import { Component } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {AuthService} from './core/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public afAuth: AngularFireAuth, private router: Router, public authService: AuthService, public afs: AngularFirestore) {
    if (window.location.pathname == '/privacy-policy') {
      return
    }
    this.afAuth.authState.subscribe(user => {
      console.log(user);
      if (user != null) {
        console.log(user.uid);
        window.localStorage.setItem('uid', user.uid)
      } else {
        this.router.navigate(['/login']);
      }
    })
  }
  logOut() {
    this.authService.doLogout()
      .then((res) => {
        this.afs.firestore.disableNetwork();
        // this.router.navigate(['/login']);
      }, (error) => {
        console.log("Logout error", error);
      });
  }
}

