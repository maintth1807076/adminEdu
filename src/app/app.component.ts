import { Component } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'again-angular';
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
  idCategories: string;
  nameCategories: string;
  lessonData: any = {};
  listLessons: any = [];
  listCourses: any = [];
  numberLesson = '';
  alive: boolean = true;
  constructor(public afs: AngularFirestore, private fb: FormBuilder) {
    this.createForm();
  }
  async createdCategory() {
    this.afs.collection('categories').add({
      createdAt: new Date().getTime(),
      description: this.formCreated.value.description,
      id: "",
      name: this.formCreated.value.name,
      arrImg: [this.formCreated.value.arrImg, this.formCreated.value.arrImg],
      status: 0,
      videoIntroduce: ''
    }).then(a => {
      this.afs.doc('categories/' + a.id).update({
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
  createForm() {

    var objCreated = [];

    objCreated['name'] = ''
    objCreated['description'] = ''
    objCreated['arrImg'] = ['']
    objCreated['videoIntroduce'] = ''


    console.log(objCreated);
    this.formCreated = this.fb.group(objCreated);
    console.log(this.formCreated);
  }
}

