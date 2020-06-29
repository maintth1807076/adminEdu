import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  constructor(public afs: AngularFirestore,public authService : AuthService, public router: Router) { }

  ngOnInit(): void {
  }

  logOut() {
    this.authService.doLogout()
      .then((res) => {
        this.afs.firestore.disableNetwork();
        window.localStorage.removeItem('lastLogin');
        window.localStorage.removeItem('timeExpired');
        // this.router.navigate(['/login']);
        // window.location.href = '/login';
      }, (error) => {
        console.log("Logout error", error);
      });
  }

}
