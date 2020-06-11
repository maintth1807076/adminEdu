import { Component } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {AuthService} from './core/auth.service';
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLogin: boolean = false;
  constructor(public afAuth: AngularFireAuth, private router: Router, public authService: AuthService, public afs: AngularFirestore) {
    if (window.location.pathname == '/privacy-policy') {
      return
    }
    this.afAuth.authState.subscribe(user => {
      if (user != null) {
        this.isLogin = true;
        window.localStorage.setItem('uid', user.uid)
      } else {
        this.router.navigate(['/login']);
      }
    })
  }
  logOut() {
    this.authService.doLogout()
      .then((res) => {
        this.isLogin = false;
        this.afs.firestore.disableNetwork();
        // this.router.navigate(['/login']);
      }, (error) => {
        console.log("Logout error", error);
      });
  }

}

