import * as admin from 'firebase-admin';
import * as express from 'express';
import { GigPlatformData } from '../../src/app/datatypes/GigPlatformData';
import { ItemBase } from '../../src/app/datatypes/ItemBase';
import { DisplaySettingsBase } from '../../src/app/datatypes/DisplaySettingsBase';
import { DataSourceConnectionData } from '../../src/app/datatypes/DataSourceConnectionData';
import { ServerUserResources } from '../../src/app/datatypes/ServerUserResources';
import { ReviewData } from '../../src/app/datatypes/ReviewData';
import { CertificationData } from '../../src/app/datatypes/CertificationData';
const functions = require('firebase-functions');

export function dataUpdateRequest(req: express.Request, res: express.Response) {
    if (req.body) {
        console.log(req.body);
    }

    // check app-id
    const app = req.query.appSecret || req.body.appSecret;
    if (app !== functions.config().app.secret) {
        res.status(405).send('invalid app id:' + app);
    }

    // get request data
    const user: string = req.query.userId || req.body.userId;
    const platformName: string = req.query.platformName || req.body.platformName;
    const datasource: string = req.query.platformId || req.body.platformId;
    const connectionState: string = req.query.platformConnectionState || req.body.platformConnectionState;
    const updated: number = parseInt(req.query.updated) || req.body.updated;
    let platformData: any = req.query.platformData || req.body.platformData;
    let reviews: any[] = []; // TODO: type server data;
    let achievements: any[] = [];
    if (platformData) {
        reviews = platformData.reviews || [];
        achievements = platformData.achievements || [];
    }

    if (typeof platformData === 'string') {
        platformData = JSON.parse(platformData);
    }

    // get user from myCvUser
    admin.firestore()
        .collection('users').where("myCvDataUser", "==", user).get().then((usersQuery: any) => {
            if (usersQuery.docs.length === 0) {
                res.status(405).send('no such user: ' + user);
                return;
            }
            const userId = usersQuery.docs[0].id; // TODO: handle multiple users with same myCvDataUser-id
            // get dataSource id from user-id and platform-id
            admin.firestore()
                .collection('dataSources')
                .where('userId', '==', userId)
                .where('sourceId', '==', datasource)
                .get().then((sourcesQuery: any) => {
                    if (sourcesQuery.docs.length === 0) {
                        res.status(405).send('no such datasource: "' + datasource + '" for user: ' + userId);
                        return;
                    }

                    // construct new aggregated data
                    const aggregatedData = <GigPlatformData>{};
                    let isAggregatedDataUpdated = false;
                    if (platformData) {
                        isAggregatedDataUpdated = true;
                        aggregatedData.noOfGigs = platformData.numberOfGigs;
                        aggregatedData.noOfRatings = platformData.numberOfRatings;
                        aggregatedData.averageRating = platformData.averageRating;
                        if (platformData.numberOfRatings > 0) {
                            aggregatedData.percentageSuccessful = platformData.numberOfSuccessfulRatings / platformData.numberOfRatings;
                        } else {
                            aggregatedData.percentageSuccessful = 0;
                        }
                        aggregatedData.startDate = platformData.periodStart;
                        aggregatedData.endDate = platformData.periodEnd;
                    }
                    // aggregatedData.alternativeRatings
                    const dataUpdate = <DataSourceConnectionData<ItemBase, DisplaySettingsBase>>{};
                    dataUpdate.isValidated = true,
                        dataUpdate.connectionState = <any>connectionState,
                        dataUpdate.lastSyncTime = updated

                    if (isAggregatedDataUpdated) {
                        dataUpdate.aggregatedData = aggregatedData;
                    }

                    // update data for matching dataSources
                    const promises: Promise<any>[] = [];
                    const successIds: string[] = [];
                    const failedIds: string[] = [];
                    sourcesQuery.docs.forEach((doc: DataSourceConnectionData<ItemBase, DisplaySettingsBase>) => {
                        const sourceId = doc.id;
                        const updatePromise = admin.firestore()
                            .collection('dataSources')
                            .doc(sourceId)
                            .set(dataUpdate, { merge: true });
                        // .update(dataUpdate);
                        promises.push(updatePromise);
                        updatePromise.then(
                            function () {
                                successIds.push(sourceId);
                            },
                            function () {
                                failedIds.push(sourceId);
                            }
                        )
                    });

                    if (reviews.length + achievements.length > 0) {
                        console.log('Updating reviews/certificates')
                        const docRef = admin.firestore().collection('userResources').doc(userId);
                        const saveData = <ServerUserResources>{};
                        reviews.forEach((review) => {
                            console.log('Parsing review:', review);
                            if (review.reviewId) {
                                if (!saveData.reviews) {
                                    saveData.reviews = {};
                                }
                                const reviewData = <ReviewData>{
                                    id: datasource + '-' + review.reviewId,
                                    reviewer: { name: review.reviewerName, title: 'Client', photo: review.reviewerPhoto || '' },
                                    organization: { name: platformName },
                                    summary: review.reviewText,
                                    rating: { min: review.rating.min || 0, max: review.rating.max || 5, value: review.rating.value || 0 },
                                    date: review.reviewDate || ''
                                }
                                saveData.reviews[reviewData.id] = reviewData;
                            }
                        });
                        console.log('achievements', achievements);
                        achievements.forEach((achievement) => {
                            console.log('Parsing certificate:', achievement);
                            if (achievement.achievementId) {
                                if (!saveData.certificates) {
                                    saveData.certificates = {}
                                }
                                const certificateData = <CertificationData>{
                                    id: datasource + '-' + achievement.achievementId,
                                    organization: { name: platformName },
                                    title: achievement.name,
                                    type: achievement.achievementType || '',
                                    summary: achievement.description,
                                    date: achievement.date || '',
                                    image: achievement.imageUrl || ''
                                }
                                if (achievement.score) {
                                    certificateData.scoreValue = achievement.score.value || 0;
                                    certificateData.scoreLabel = achievement.score.label || '';
                                }
                                saveData.certificates[certificateData.id] = certificateData;
                            }
                        });
                        console.log('saving userResources:', saveData);
                        promises.push(docRef.set(saveData, { merge: true }));
                    }

                    Promise.all(promises).then(
                        function () {
                            res.send('OK, updated data for sources: ' + successIds.join(','));
                        },
                        function (e) {
                            res.status(405).send('couldnt update data for source: ' + failedIds.join(','));
                        }
                    )

                });

        });
}