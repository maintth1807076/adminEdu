import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {takeWhile} from 'rxjs/operators';

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.css']
})
export class CreateEditLessonComponent implements OnInit {

  formCreated: FormGroup;
  alive: boolean = true;
  sttNotifi: boolean = false;
  textNotifi: string;
  sttTextNotifi: string = 'toast-success';
  sttLoading: boolean = false;
  lessonId: string;
  sttAdd: boolean = true;
  categories: any = [];
  courses: any = [];
  weeks: any = [];
  position: number;

  constructor( private _location: Location, private router: Router, public afAuth: AngularFireAuth, private http: HttpClient, private fb: FormBuilder, public afs: AngularFirestore) {
    this.createForm();
    this.getDataClient();
    var url = window.location.href;
    this.lessonId = this.getParameterByName('id', url);
    if (this.lessonId != null && this.lessonId.length > 0) {
      afs.doc('lessons/' + this.lessonId).get().subscribe(a => {
        var objCreated = [];
        objCreated['description'] = [a.data().description]
        objCreated['position'] = [a.data().position]
        objCreated['weekId'] = [a.data().weekId]
        objCreated['name'] = [a.data().name]
        objCreated['estimatedTime'] = [a.data().estimatedTime]
        objCreated['link'] = [a.data().link]
        this.formCreated = this.fb.group(objCreated);
        this.sttAdd = false;
      })
    }
   }

  ngOnInit() {
  }

  getDataClient() {
    this.afs.collection('categories').valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.categories = data;
      })
    this.afs.collection('courses').valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.courses = data;
      })
    this.afs.collection('weeks').valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.weeks = data;
      })
  }

  filterCourseByCategory(id: string) {
    this.afs.collection('courses', ref => ref.where('categoryId', '==', id)).valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.courses = data;
      })
  }

  filterWeekByCourse(id: string) {
    this.afs.collection('weeks', ref => ref.where('courseId', '==', id)).valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.weeks = data;
      })
  }

  createForm() {
    var objCreated = [];
    objCreated['name'] = [''];
    objCreated['link'] = [''];
    objCreated['description'] = [''];
    objCreated['estimatedTime'] = [''];
    objCreated['position'] = [''];
    objCreated['weekId'] = [''];
    this.formCreated = this.fb.group(objCreated);
  }
  async createdLesson() {
    this.sttLoading = true;
    this.sttNotifi = false;
    if (!this.sttAdd) {
      this.afs.doc('lessons/' + this.lessonId).update({
        name: this.formCreated.value.name,
        estimatedTime: this.formCreated.value.estimatedTime,
        link: this.formCreated.value.link,
        description: this.formCreated.value.description,
        updatedAt: new Date().getTime(),
      }).then(a => {
        this.sttLoading = false;
        this.sttNotifi = true;
        this.textNotifi = 'Sửa thành công';
        this.sttTextNotifi = 'toast-success';
        this.formCreated.reset()
      }).catch(er => {
        console.log(er);
        this.sttLoading = false;
        this.sttNotifi = true;
        this.textNotifi = er.msg;
        this.sttTextNotifi = 'toast-error';
      })
    } else {
      if(this.formCreated.value.weekId == 0){
        alert('phải chọn chương đã')
        return;
      }
      this.afs.collection('lessons').add({
        weekId: this.formCreated.value.weekId,
        name: this.formCreated.value.name,
        estimatedTime: this.formCreated.value.estimatedTime,
        link: this.formCreated.value.link,
        createdAt: new Date().getTime(),
        description: this.formCreated.value.description,
        id: "",
        updatedAt: new Date().getTime(),
        position: this.position + 1
      }).then(a => {
        this.afs.doc('lessons/' + a.id).update({
          id: a.id
        })
        alert('them thanh cong')
        this.sttLoading = false;
        this.sttNotifi = true;
        this.textNotifi = 'Thêm thành công';
        this.sttTextNotifi = 'toast-success';
        this.formCreated.reset()
      }).catch(er => {
        this.sttLoading = false;
        this.sttNotifi = true;
        this.textNotifi = er.msg;
        this.sttTextNotifi = 'toast-error';
      })
    }
  }

  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  dismissToast() {
    this.sttNotifi = false;
  }

  getPositionLesson(id) {
    this.afs.collection('lessons', ref=>ref.where('weekId', '==', id)).valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.position = data.length;
      })
  }
}
