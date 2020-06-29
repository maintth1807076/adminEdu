import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {AuthService} from '../../core/auth.service';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  sttLoading: boolean = false;

  constructor(public afs: AngularFirestore,
              public authService: AuthService,
              private router: Router,
              private fb: FormBuilder,
              private toastService: ToastrService) {
    this.createForm();
  }

  ngOnInit(): void {
  }
  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  tryLogin(value) {
    this.sttLoading = true;
    this.authService.doLogin(value)
      .then(res => {
        this.sttLoading = false;
        console.log(res.user.uid);
        this.afs.doc('users/' + res.user.uid).valueChanges().subscribe(data => {

          // if (data == undefined) {
          //   return window.location.reload()
          // }
          console.log(data);
          this.afs.firestore.enableNetwork();
          window.localStorage.setItem('uid', res.user.uid);
          this.setTimeLogin();
          this.router.navigate(['/category']);
          // this.sttLoading = false;
        })
      }, err => {
        this.sttLoading = false;
        this.errorMessage = err.message;
        this.toastService.error(this.errorMessage, '', {timeOut: 5000})
      })
  }

  logOut() {
    this.authService.doLogout()
      .then((res) => {
        this.afs.firestore.disableNetwork();
        window.localStorage.removeItem('lastLogin');
        window.localStorage.removeItem('timeExpired');
        // this.router.navigate(['/login']);
      }, (error) => {
        console.log("Logout error", error);
      });
  }

  setTimeLogin() {
    const d = new Date().getTime();
    let timeExpired = moment(d).add(1, 'hours').toDate().getTime();
    window.localStorage.setItem('lastLogin', d.toString());
    window.localStorage.setItem('timeExpired', timeExpired.toString())
  }

}
