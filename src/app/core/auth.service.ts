import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth,
              private afs: AngularFirestore,) {

  }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      firebase.auth()
        .signInWithPopup(provider)
        .then(res => {
          
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        })
    })
  }

  doLogin(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
        .then(res => {
          this.setTimeLogin();
          resolve(res);
        }, err => reject(err))
    })
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        window.localStorage.clear();
        console.log('clear succes');
        firebase.auth().signOut()
        resolve();
      }
      else {
        reject();
      }
    });
  }

  setTimeLogin() {
    const d = new Date().getTime();
    let timeExpired = moment(d).add(1, 'hours').toDate().getTime();
    window.localStorage.setItem('lastLogin', d.toString());
    window.localStorage.setItem('timeExpired', timeExpired.toString())
  }
}
