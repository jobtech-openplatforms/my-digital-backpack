import { DocumentSnapshot } from "@angular/fire/firestore";
import { EventContext } from "firebase-functions";
import * as nodemailer from 'nodemailer';
import * as admin from 'firebase-admin';
import { ServerUserResources } from "../../src/app/datatypes/ServerUserResources";
const functions = require('firebase-functions');

const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: functions.config().mailclient.user,
        pass: functions.config().mailclient.pass,
    },
});

function sendMail(mailOptions: any) {
    return mailTransport.sendMail(mailOptions)
        .then(() => console.log(`Notification email sent to:`, mailOptions.to))
        .catch((error: any) => console.error('Error sending notification email:', error, mailOptions));
}

function isAdmin(userId = '') {
    return new Promise((resolve, reject) => {
        admin.firestore().collection('platformSettings').doc('adminSettings').get().then(
            (snapshot) => {
                const settings = snapshot.data();
                if (settings && settings.writeAccess) {
                    if (settings.writeAccess.indexOf(userId) > -1) {
                        resolve(true);
                    } else {
                        console.log('Does not have admin priviligies');
                        reject();
                    }
                }
            },
            (e) => {
                console.log('Could not access admin settings');
                reject();
            }
        )
    });
}

export function createdServerCommand(snap: DocumentSnapshot<any>, context: EventContext) {
    const commandData = snap.data();

    console.log(commandData);
    if (commandData) {
        if (commandData.type === 'ManualValidationRequest') {
            const mailOptions = {
                from: '"My Digital Backpack" <noreply@mydigitalbackpack.org>',
                to: 'david.sjolander@gmail.com',
                subject: 'New manual validation request - ' + commandData.data.dataSourceId,
                text:
                    'A user has requested that their data is validated. ' + '\n' +
                    '\n' +
                    'User: ' + commandData.userId + '\n' +
                    'Datasource: ' + commandData.data.dataSourceId + '\n' +
                    'User email: ' + commandData.data.email + '\n' +
                    'User profileUrl: ' + commandData.data.profileUrl + '\n' +
                    '\n' +
                    'Link: ' + 'https://mycvdata-dbaac.firebaseapp.com/#/edit-data-source/' + commandData.data.dataSourceId
            };
            return sendMail(mailOptions);
        }


        else if (commandData.type === 'NewDataSourceNotification') {
            const mailOptions = {
                from: '"My Digital Backpack" <noreply@mydigitalbackpack.org>',
                to: 'david.sjolander@gmail.com',
                subject: 'New custom datasource added - ' + commandData.data.dataSourceId,
                text:
                    'A user has added a new custom datasource. ' + '\n' +
                    '\n' +
                    'User: ' + commandData.userId + '\n' +
                    'User email: ' + commandData.data.email + '\n' +
                    '\n' +
                    'Link: ' + 'https://mycvdata-dbaac.firebaseapp.com/#/edit-data-source/' + commandData.data.dataSourceId
            };
            return sendMail(mailOptions);
        }

        else if (commandData.type === 'Feedback') {
            const mailOptions = {
                from: '"My Digital Backpack" <noreply@mydigitalbackpack.org>',
                to: 'david.sjolander@gmail.com',
                subject: 'New user feedback',
                text:
                    'A user has sent the following feedback: ' + '\n' +
                    '\n' +
                    'Message: ' + '\n' +
                    commandData.data.message + '\n' +
                    '\n' +
                    'User: ' + commandData.userId + '\n' +
                    'User email: ' + commandData.data.email + '\n'
            };
            return sendMail(mailOptions);
        }

        else if (commandData.type === 'ValidateReview') {
            return new Promise((resolve, reject) => {
                admin.firestore()
                    .collection('userResources')
                    .doc(commandData.userId)
                    .get().then(
                        (userResourcesData: any) => {
                            if (userResourcesData) {
                                const userResources: ServerUserResources = userResourcesData.data()
                                const review = userResources.reviews[commandData.data.reviewId];
                                console.log('review found', review);
                                const newData = {
                                    isValidated: true,
                                    aggregatedData: review,
                                    lastSyncTime: Date.now()
                                }
                                admin.firestore()
                                    .collection('dataSources')
                                    .doc(commandData.data.dataSourceId)
                                    .set(newData, { merge: true }).then(
                                        () => {
                                            console.log('OK, validated review: ' + commandData.data.dataSourceId);
                                            resolve();
                                        },
                                        () => {
                                            console.log('Could not update review: ' + commandData.data.dataSourceId);
                                            reject();
                                        }
                                    );
                            } else {
                                console.log('Could not get userResources.review: ' + commandData.data.reviewId);
                                reject();
                            }
                        },
                        () => {
                            console.log('Could not get userResources: ' + commandData.userId);
                            reject();
                        }
                    );
            });
        } else if (commandData.type === 'ValidateCertificate') { // TODO: merge with validate review?
            return new Promise((resolve, reject) => {
                admin.firestore()
                    .collection('userResources')
                    .doc(commandData.userId)
                    .get().then(
                        (userResourcesData: any) => {
                            if (userResourcesData) {
                                const userResources: ServerUserResources = userResourcesData.data()
                                const certificate = userResources.certificates[commandData.data.certificateId];
                                console.log('review found', certificate);
                                const newData = {
                                    isValidated: true,
                                    aggregatedData: certificate,
                                    lastSyncTime: Date.now()
                                }
                                admin.firestore()
                                    .collection('dataSources')
                                    .doc(commandData.data.dataSourceId)
                                    .set(newData, { merge: true }).then(
                                        () => {
                                            console.log('OK, validated certificate: ' + commandData.data.dataSourceId);
                                            resolve();
                                        },
                                        () => {
                                            console.log('Could not update certificate: ' + commandData.data.dataSourceId);
                                            reject();
                                        }
                                    );
                            } else {
                                console.log('Could not get userResources.review: ' + commandData.data.certificateId);
                                reject();
                            }
                        },
                        () => {
                            console.log('Could not get userResources: ' + commandData.userId);
                            reject();
                        }
                    );
            });
        }
        else if (commandData.type === 'RemoveUser') {
            return new Promise((resolve, reject) => {
                const removeFunction = () => {
                    return removeUserData(commandData.data.targetId, commandData.id).then(
                        () => resolve(),
                        () => reject()
                    )
                }
                // check if user is admin OR existing user
                if (commandData.data.targetId === commandData.userId) {
                    removeFunction();
                } else {
                    isAdmin(commandData.userId).then(
                        () => removeFunction(),
                        () => reject()
                    );
                }
            });
        }
    }
    console.log('Unknown commandtype');
    return;
}

function removeUserData(userId = '', commandId: string) {
    return new Promise((resolve, reject) => {
        console.log('Removing data for user:', userId);
        const promiseDataSources = admin.firestore().collection('dataSources').where('userId', '==', userId).get()
            .then((querySnapshot) => {
                const batch = admin.firestore().batch();
                querySnapshot.forEach((doc) => {
                    console.log('removing datasource: ', doc.id);
                    batch.delete(doc.ref);
                });
                return batch.commit();
            })
            .then(() => {
                console.log('all datasources removed');
            });

        const promiseUserResourceDoc = admin.firestore().collection('userResources').doc(userId).delete()
            .then(() => {
                console.log('user resource removed');
            });

        const promiseDocuments = admin.firestore().collection('documents').where('userId', '==', userId).get()
            .then((querySnapshot) => {
                const batch = admin.firestore().batch();
                querySnapshot.forEach((doc) => {
                    console.log('removing document: ', doc.id);
                    batch.delete(doc.ref);
                });
                return batch.commit();
            })
            .then(() => {
                console.log('all documents removed');
            });

        const promiseUserData = admin.firestore().collection('users').doc(userId).delete()
            .then(() => {
                console.log('user data removed');
            });

        Promise.all([promiseDataSources, promiseUserResourceDoc, promiseDocuments, promiseUserData]).then(
            () => {
                console.log('All user related data (except auth) is removed');
                admin.firestore().collection('commands').doc(commandId).update({ result: 'success' });
                resolve();
            },
            () => {
                console.log('Failed to remove all user data');
                admin.firestore().collection('commands').doc(commandId).update({ result: 'failure' });
                reject();
            }
        )
    });
}