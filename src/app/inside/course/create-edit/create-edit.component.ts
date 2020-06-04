import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {takeWhile} from "rxjs/operators";

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.css']
})
export class CreateEditCourseComponent implements OnInit {
  formCreated: FormGroup;
  // notiffi
  sttNotifi: boolean = false;
  textNotifi: string;
  sttTextNotifi: string = 'toast-success';
  sttLoading: boolean = false;
  idDoc: string;
  type: string;
  sttAdd: boolean = true;
  idCategories: string;
  constructor(private _location: Location, private router: Router, public afAuth: AngularFireAuth, private http: HttpClient, private fb: FormBuilder, public afs: AngularFirestore) {
    this.createForm();
    var url = window.location.href;
    this.idDoc = this.getParameterByName('id', url);
    this.type = this.getParameterByName('type', url);
    this.idCategories = this.getParameterByName('idCategories', url);
    console.log(this.idDoc, this.type);

    if (this.idDoc != 'none') {
      afs.doc('courses/' + this.idDoc).get().subscribe(a => {
        console.log('rrrrrrrr ', a.data());
        var objCreated = [];

        // objCreated['name'] = [a.data().name]
        // objCreated['urlImg'] = [a.data().urlImg]
        // objCreated['description'] = [a.data().description]

        objCreated['name'] = [a.data().name]
        objCreated['description'] = [a.data().description]
        objCreated['videoIntroduce'] = [a.data().videoIntroduce]
        objCreated['price'] = [a.data().price]
        objCreated['discount'] = [a.data().discount]

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

    objCreated['name'] = ['']
    objCreated['description'] = ['']
    objCreated['videoIntroduce'] = ['']
    objCreated['price'] = ['']
    objCreated['discount'] = ['']
    objCreated['teacherIds'] = ['']

    console.log(objCreated);
    this.formCreated = this.fb.group(objCreated);
    console.log(this.formCreated);
  }



  async createdBook() {
    this.sttLoading = true;
    this.sttNotifi = false;
    console.log(this.formCreated.value);
    console.log('this.sttAdd ', this.sttAdd);

    // let ratePrice = Math.ceil(100 - ((Number(this.formCreated.value.priveSell) / Number(this.formCreated.value.price)) * 100));
    // console.log(ratePrice);
    console.log(Number(this.formCreated.value.price));
    console.log(Number(this.formCreated.value.priveSell));


    if (!this.sttAdd) {
      this.afs.doc('courses/' + this.idDoc).update({
        videoIntroduce: this.formCreated.value.videoIntroduce,
        name: this.formCreated.value.name,
        description: this.formCreated.value.description,
        price: Number(this.formCreated.value.price),
        discount: Number(this.formCreated.value.discount),
        updatedAt: new Date().getTime()
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
      this.afs.collection('courses').add({
        categoryId: this.idCategories,
        createdAt: new Date().getTime(),
        description: this.formCreated.value.description,
        id: "",
        name: this.formCreated.value.name,
        teacherIds: this.formCreated.value.teacherIds,
        price: Number(this.formCreated.value.price),
        discount: Number(this.formCreated.value.discount),
       coachingService:"",
       courseLevel:"",
       discountCode:"",
       estimatedTime:"",
       followUpRequestAccept:"",
       followUpRequestMax:"",
        updatedAt: new Date().getTime(),
        likedUserIds:"",
        thumbnail:"",

      }).then(async a => {
        await this.afs.doc('courses/' + a.id).update({
          id: a.id
        })
        // await this.afs.doc('categories/' + this.idCategories).get().subscribe(dataCategorie => {
        //   let amount = dataCategorie.data().totalCourse + 1;
        //   this.afs.doc('categories/' + this.idCategories).update({
        //     totalCourse: amount
        //   })
        // });

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
  async deleted() {
    this.afs.doc('courses/' + this.idDoc).delete().then(a => {
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


