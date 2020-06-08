import { Component, OnInit } from '@angular/core';
import {takeWhile} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.css']
})
export class CreateEditSyllabusComponent implements OnInit {
  alive: boolean = true;
  formCreated: FormGroup;
  sttNotifi: boolean = false;
  textNotifi: string;
  sttTextNotifi: string = 'toast-success';
  sttLoading: boolean = false;
  categories: any = [];
  courses: any = [];
  constructor(public afs: AngularFirestore, private fb: FormBuilder) {
    this.createForm();
    this.getDataClient();
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

  filterCourseByCategory(id: string) {
    this.afs.collection('courses', ref => ref.where('categoryId', '==', id)).valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.courses = data;
      })
  }
  createForm() {
    var objCreated = [];
    objCreated['courseId'] = [0];
    objCreated['description'] = [''];
    objCreated['videoIntroduce'] = [''];
    objCreated['price'] = [''];
    objCreated['discount'] = [''];
    objCreated['teacherIds'] = [''];
    objCreated['categoryId'] = 0;
    this.formCreated = this.fb.group(objCreated);
  }

  async createdWeek() {
    this.sttLoading = true;
    this.sttNotifi = false;
    // if (!this.sttAdd) {
    //   this.afs.doc('weeks/' + this.idDoc).update({
    //     description: this.formCreated.value.description,
    //     position: this.formCreated.value.position,
    //     updatedAt: new Date().getTime(),
    //   }).then(a => {
    //     this.sttLoading = false;
    //     this.sttNotifi = true;
    //     this.textNotifi = 'Sửa thành công';
    //     this.sttTextNotifi = 'toast-success';
    //     this.formCreated.reset()
    //   }).catch(er => {
    //     console.log(er);
    //     this.sttLoading = false;
    //     this.sttNotifi = true;
    //     this.textNotifi = er.msg;
    //     this.sttTextNotifi = 'toast-error';
    //   })
    // } else {
    //   await this.afs.doc('courses/' + this.courseId).get().subscribe(dataCourse => {
    //     // let amount = dataCourse.data().totalLesson + 1;
    //     // this.afs.doc('courses/' + this.courseId).update({
    //     //   totalLesson: amount
    //     // })
    //     this.afs.collection('weeks').add({
    //       courseId: this.courseId,
    //       courseName: this.courseName,
    //       createdAt: new Date().getTime(),
    //       description: this.formCreated.value.description,
    //       id: "",
    //       position: this.formCreated.value.position,
    //       updatedAt: new Date().getTime(),
    //     }).then(a => {
    //       this.afs.doc('weeks/' + a.id).update({
    //         id: a.id
    //       })
    //       this.sttLoading = false;
    //       this.sttNotifi = true;
    //       this.textNotifi = 'Thêm thành công';
    //       this.sttTextNotifi = 'toast-success';
    //       this.formCreated.reset()
    //     }).catch(er => {
    //       this.sttLoading = false;
    //       this.sttNotifi = true;
    //       this.textNotifi = er.msg;
    //       this.sttTextNotifi = 'toast-error';
    //     })
    //   });

    }
}
