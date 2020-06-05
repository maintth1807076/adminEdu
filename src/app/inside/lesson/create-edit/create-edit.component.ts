import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.css']
})
export class CreateEditLessonComponent implements OnInit {
  formCreated: FormGroup;
  // notiffi
  sttNotifi: boolean = false;
  textNotifi: string;
  sttTextNotifi: string = 'toast-success';
  sttLoading: boolean = false;
  idDoc: string;
  type: string;
  sttAdd: boolean = true;

  courseName: string;
  courseId: string;
 
  constructor( private _location: Location, private router: Router, public afAuth: AngularFireAuth, private http: HttpClient, private fb: FormBuilder, public afs: AngularFirestore) {
    this.createForm();
    var url = window.location.href;
    this.idDoc = this.getParameterByName('id', url);
    this.courseName = this.getParameterByName('courseName', url);
    this.courseId = this.getParameterByName('courseId', url);
    console.log(this.idDoc, this.type);

    if (this.idDoc != 'none') {
      afs.doc('weeks/' + this.idDoc).get().subscribe(a => {
        console.log('rrrrrrrr ', a.data());
        var objCreated = [];

        objCreated['description'] = [a.data().description]
        objCreated['position'] = [a.data().position]
        objCreated['courseId'] = [a.data().courseId]

        // objCreated['videoUrl'] = [a.data().url]

        console.log(objCreated);
        this.formCreated = this.fb.group(objCreated);
        this.sttAdd = false;
      })
    }
   }

  ngOnInit() {
  }

  createForm() {

    var objCreated = [];

    objCreated['description'] = ['']
    objCreated['position'] = ['']
    objCreated['courseId'] = ['']

    console.log(objCreated);
    this.formCreated = this.fb.group(objCreated);
    console.log(this.formCreated);
  }
  async createdBook() {
    this.sttLoading = true;
    this.sttNotifi = false;
    console.log(this.formCreated.value);
    console.log('this.sttAdd ', this.sttAdd);

    let ratePrice = Math.ceil(100 - ((Number(this.formCreated.value.priveSell) / Number(this.formCreated.value.price)) * 100));
    console.log(ratePrice);
    console.log(Number(this.formCreated.value.price));
    console.log(Number(this.formCreated.value.priveSell));


    if (!this.sttAdd) {
      this.afs.doc('weeks/' + this.idDoc).update({
        description: this.formCreated.value.description,
        position: this.formCreated.value.position,
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
      await this.afs.doc('courses/' + this.courseId).get().subscribe(dataCourse => {
        // let amount = dataCourse.data().totalLesson + 1;
        // this.afs.doc('courses/' + this.courseId).update({
        //   totalLesson: amount
        // })
        this.afs.collection('weeks').add({
          courseId: this.courseId,
          courseName: this.courseName,
          createdAt: new Date().getTime(),
          description: this.formCreated.value.description,
          id: "",
          position: this.formCreated.value.position,
          updatedAt: new Date().getTime(),
        }).then(a => {
          this.afs.doc('weeks/' + a.id).update({
            id: a.id
          })
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
      });

    }
  }
  async deleted() {
    this.afs.doc('weeks/' + this.idDoc).delete().then(a => {
      this.sttLoading = false;
      this.sttNotifi = true;
      this.textNotifi = 'Xóa thành công';
      this.sttTextNotifi = 'toast-success';
      this.formCreated.reset();
      setTimeout(() => {
        this._location.back();
        // this.router.navigate(['/bai-hoc/' + this.type]);
        // this.router.navigate.go
      }, 1500);
    }).catch(er => {
      this.sttLoading = false;
      this.sttNotifi = true;
      this.textNotifi = er.msg;
      this.sttTextNotifi = 'toast-error';
    })
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
}
