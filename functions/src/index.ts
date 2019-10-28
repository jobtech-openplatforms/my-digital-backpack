import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { createdServerCommand } from './ServerCommandQueueHandler';
import { dataUpdateRequest } from './DataUpdateRequestHandler';
import { validateTokenRequest } from './ValidateTokenRequestHandler';

admin.initializeApp();

// handle added commands added to server commands queue
exports.createCommand = functions.firestore
  .document('commands/{commandId}')
  .onCreate(<any>createdServerCommand);

// handle new updated platform data
exports.updatedata = functions.https
  .onRequest(dataUpdateRequest);

// validate invite tokens
exports.validateinvite = functions.https
  .onRequest(validateTokenRequest);