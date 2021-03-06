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
  formWeekCreated: FormGroup;
  formLessonCreated: FormGroup;
  sttNotifi: boolean = false;
  textNotifi: string;
  sttTextNotifi: string = 'toast-success';
  sttLoading: boolean = false;
  sttAdd: boolean = true;
  categories: any = [];
  courses: any = [];
  weeks: any = [];
  lessons: any = [];
  weekId: string;

  constructor(public afs: AngularFirestore, private fb: FormBuilder) {
    this.createForm();
    this.getDataClient();
    // var url = window.location.href;
    // this.weekId = this.getParameterByName('weekId', url);
    // console.log(this.weekId)
    // if(this.weekId != null && this.weekId.length > 0){
    //   this.getDataWeek(this.weekId);
    // }
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
  getDataWeek(id) {
    this.weekId = id;
    this.afs.doc('weeks/' + id).get().subscribe(a => {
      var objCreated = [];
      objCreated['name'] = a.data().name;
      objCreated['description'] = a.data().description;
      objCreated['position'] = a.data().position
      this.formWeekCreated = this.fb.group(objCreated);
      this.sttAdd = false;
    })
  }
  filterCourseByCategory(id: string) {
    this.afs.collection('courses', ref => ref.where('categoryId', '==', id)).valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.courses = data;
      })
  }
  createSyllabus() {
  }

  createForm() {
    var objCreated = [];
    objCreated['courseId'] = [0];
    this.formCreated = this.fb.group(objCreated);
    var objCreated1 = [];
    objCreated1['name'] = [''];
    objCreated1['description'] = [''];
    objCreated1['position'] = [''];
    this.formWeekCreated = this.fb.group(objCreated1);
    var objCreated2 = [];
    objCreated2['name'] = [''];
    objCreated2['link'] = [''];
    objCreated2['description'] = [''];
    objCreated2['estimatedTime'] = [''];
    objCreated2['position'] = [''];
    this.formLessonCreated = this.fb.group(objCreated2);
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

  getDataLesson(id: any) {
    // this.afs.collection('lessons').add({
    //   // weekId: id,
    //   // createdAt: new Date().getTime(),
    //   // position: 2,
    //   // description: "Phân tích nội dung",
    //   // name: "Nội dung chuyên sâu",
    //   // link: "https://www.youtube.com/watch?v=5aMiuIAYNMw",
    //   // type: 2
    //   weekId: id,
    //   createdAt: new Date().getTime(),
    //   position: 1,
    //   description: "Giới thiệu",
    //   name: "Giới thiệu",
    //   link: "https://giasunhanvan.com/cuoc-doi-va-van-hoc.html",
    //   type: 1
    // })
    this.afs.collection('lessons', ref => ref.where('weekId', '==', id)).valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.lessons = data.sort((a, b)=> {
          return  a['position'] - b['position']});
      })
    // this.afs.collection('lessons').valueChanges().pipe().subscribe(a => {
    //   a.forEach(value => {
    //     console.log()
    //     this.afs.doc('lessons/' + value['id']).update({
    //       estimatedTime: 3600
    //     })
    //   })
    //
    // })
  }

  async createdLesson() {
    this.sttLoading = true;
    this.sttNotifi = false;
    this.sttAdd = true;
    if (!this.sttAdd) {
      this.afs.doc('lessons/' + this.weekId).update({
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
        await this.afs.collection('lessons', ref=>ref.where('weekId', '==', this.weekId)).valueChanges()
          .pipe(takeWhile(() => this.alive))
          .subscribe(data => {
            let position = data.length + 1;
            this.afs.collection('lessons').add({
              name: this.formLessonCreated.value.name,
              estimatedTime: this.formLessonCreated.value.estimatedTime,
              link: this.formLessonCreated.value.link,
              createdAt: new Date().getTime(),
              description: this.formCreated.value.description,
              id: "",
              updatedAt: new Date().getTime(),
              position: position
            }).then(a => {
              this.afs.doc('lessons/' + a.id).update({
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
          })
    }
  }
}
