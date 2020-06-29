import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { takeWhile } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  formCreated: FormGroup;
  idCourse: string;
  alive: boolean = true;
  sttNotifi: boolean = false;
  textNotifi: string;
  sttTextNotifi: string = 'toast-success';
  sttLoading: boolean = false;
  courses: any = [];
  weeks: any = [];

  constructor(private _location: Location, public afAuth: AngularFireAuth, private http: HttpClient, private formBuilder: FormBuilder, public afs: AngularFirestore, private storage: AngularFireStorage) {
    this.createForm();
    var url = window.location.href;
    this.idCourse = this.getParameterByName('id', url);
    this.getDataClient();
  }

  ngOnInit(): void {
  }

  getDataClient() {
    this.afs.collection('courses').valueChanges().pipe(takeWhile(() => this.alive)).subscribe(data => {
      this.courses = data;
    })
  }

  createForm() {
    this.formCreated = this.formBuilder.group({
      courseId: ['', Validators.required]
    })
  }

  filterWeekByCourse(id: string) {
    this.afs.collection('weeks', ref => ref.where('courseId', '==', id)).valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.weeks = data;
      })
  }

  async createdScheduleCourse() {

    this.sttLoading = true;
    this.sttNotifi = false;
    this.afs.collection('scheduleCourses').add({
      createdAt: new Date().getTime(),
      id: '',
      courseId: this.formCreated.value.courseId,
    }).then(async a => {
      await this.afs.doc('scheduleCourses/' + a.id).update({
        id: a.id
      });
      alert('Luu thanh cong')
      this.sttLoading = false;
      this.sttNotifi = true;
      this.textNotifi = 'Lưu thành công';
      this.sttTextNotifi = 'toast-success';
      this.formCreated.reset();
      window.location.href = '/schedule';
    }).catch(er => {
      this.sttLoading = false;
      this.sttNotifi = true;
      this.textNotifi = er.msg;
      this.sttTextNotifi = 'toast-error';
    });
  };

  async deleted() {
    this.afs.doc('scheduleCourses/' + this.idCourse).delete().then(a => {
      this.sttLoading = false;
      this.sttNotifi = true;
      this.textNotifi = 'Xóa thành công';
      this.sttTextNotifi = 'toast-success';
      this.formCreated.reset();
      setTimeout(() => {
        // this.router.navigate(['/book/' + this.type]);
        this._location.back();
      }, 1500);
    }).catch(er => {
      this.sttLoading = false;
      this.sttNotifi = true;
      this.textNotifi = er.msg;
      this.sttTextNotifi = 'toast-error';
    });
  }

  getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  dismissToast() {
    this.sttNotifi = false;
  }
}
