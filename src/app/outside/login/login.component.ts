import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {AuthService} from '../../core/auth.service';

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
              private fb: FormBuilder) {
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
          window.localStorage.setItem('uid', res.user.uid)
          this.router.navigate(['/category']);
          this.sttLoading = false;
        })
      }, err => {
        this.sttLoading = false;
        this.errorMessage = err.message;
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
