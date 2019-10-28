import * as admin from 'firebase-admin';
import * as express from 'express';

const cors = require('cors')({ origin: true });

export function validateTokenRequest(req: express.Request, res: express.Response) {
    cors(req, res, () => {
        if (req.body) {
            console.log(req.body);
            if (typeof (req.body) === 'string') {
                req.body = JSON.parse(req.body);
            }
        }

        // get request data
        const user: string = req.body.user;
        const token: string = req.body.token;
        console.log(user, token);

        const tokenDoc = admin.firestore()
            .collection('tokens')
            .doc(token);
        tokenDoc.get().then(
            (doc) => {
                if (doc.exists) {
                    const tokenData = doc.data();
                    if (tokenData && tokenData.type === 'invite' && tokenData.left > 0) {
                        tokenData.left--;
                        tokenDoc.update(tokenData);
                        res.send('OK, validated token: ' + token);
                    } else {
                        res.status(405).send('token not valid: ' + token);
                    }
                } else {
                    res.status(405).send('no such token: ' + token);
                }
            },
            () => {
                res.status(405).send('no such token: ' + token);
            }
        );
    });
}