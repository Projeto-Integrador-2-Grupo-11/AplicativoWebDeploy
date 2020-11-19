import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export default ({ app }, inject) => {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: app.$env.FIREBASE_API_KEY,
      authDomain: app.$env.FIREBASE_AUTH_DOMAIN,
      projectId: app.$env.FIREBASE_PROJECT_ID,
    });
  }

  inject('firebaseAuth', firebase.auth());
  inject('firestore', firebase.firestore());
};