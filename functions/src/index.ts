/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { auth } from 'firebase-functions/v1';
import admin from 'firebase-admin';
admin.initializeApp();

export const createFirestoreUser = auth.user().onCreate(async user => {
  // I really hate this, but for this to have a sub collection it has to have at least one record, so we then immediately delete it.
  const userRecord = admin.firestore().collection('users').doc(user.uid);
  await userRecord.create({ email: user.email, subscriptionTier: 'free' });
  const honorees = userRecord.collection(`honorees`);
  const val = await honorees.add({});
  await honorees.doc(val.id).delete();
});
