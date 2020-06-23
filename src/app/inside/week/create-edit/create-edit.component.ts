import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {takeWhile} from 'rxjs/operators';

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.css']
})
export class CreateEditWeekComponent implements OnInit {

  alive: boolean = true;
  formCreated: FormGroup;
  sttNotifi: boolean = false;
  textNotifi: string;
  sttTextNotifi: string = 'toast-success';
  sttLoading: boolean = false;
  sttAdd: boolean = true;
  categories: any = [];
  courses: any = [];
  weekId: string;
  position: number;

  constructor(private router: Router, private fb: FormBuilder, public afs: AngularFirestore) {
    this.createForm();
    this.getDataClient();
    var url = window.location.href;
    this.weekId = this.getParameterByName('id', url);
    if(this.weekId != null && this.weekId.length > 0){
      afs.doc('weeks/' + this.weekId).get().subscribe(a => {
        var objCreated = [];
        objCreated['name'] = a.data().name;
        objCreated['description'] = a.data().description;
        objCreated['position'] = a.data().position
        objCreated['courseId'] = a.data().courseId
        this.formCreated = this.fb.group(objCreated);
        this.sttAdd = false;
      })
    }
  }

  ngOnInit(): void {
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
  }

  createForm() {
    this.formCreated = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      position: ['', Validators.required],
      courseId: ['', Validators.required],
      categoryId: ['', Validators.required]
    })
    // var objCreated = [];
    // objCreated['name'] = [''];
    // objCreated['description'] = [''];
    // objCreated['position'] = [''];
    // objCreated['courseId'] = [''];
    // this.formCreated = this.fb.group(objCreated);
  }

  filterCourseByCategory(id: string) {
    this.afs.collection('courses', ref => ref.where('categoryId', '==', id)).valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.courses = data;
      })
  }

  async createdWeek() {
    this.sttLoading = true;
    this.sttNotifi = false;
    if (!this.sttAdd) {
      this.afs.doc('weeks/' + this.weekId).update({
        name: this.formCreated.value.name,
        description: this.formCreated.value.description,
        updatedAt: new Date().getTime(),
      }).then(a => {
        this.sttLoading = false;
        this.sttNotifi = true;
        this.textNotifi = 'Sửa thành công';
        this.sttTextNotifi = 'toast-success';
        this.formCreated.reset()
      }).catch(er => {
        this.sttLoading = false;
        this.sttNotifi = true;
        this.textNotifi = er.msg;
        this.sttTextNotifi = 'toast-error';
      })
    } else {
      if(this.formCreated.invalid){
        alert("invalid");
        return;
      }
      // if(this.formCreated.value.courseId.length == 0){
      //   alert('phải chọn khóa học đã');
      //   return;
      // }
      this.afs.collection('weeks').add({
        name: this.formCreated.value.name,
        courseId: this.formCreated.value.courseId,
        createdAt: new Date().getTime(),
        description: this.formCreated.value.description,
        id: "",
        updatedAt: new Date().getTime(),
        position: this.position + 1
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
    }
  }
  getPositionWeek(id) {
    this.afs.collection('weeks', ref=>ref.where('courseId', '==', id)).valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.position = data.length;
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
  u(){
    this.afs.collection('weeks').valueChanges().pipe().subscribe(a => {
      a.forEach(value => {
        if(value['position'] > 5){
          this.afs.doc('weeks/' + value['id']).delete()
        }

      })
    })
  }
}
