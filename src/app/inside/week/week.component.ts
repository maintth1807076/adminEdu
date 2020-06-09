import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {takeWhile} from 'rxjs/operators';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.css']
})
export class WeekComponent implements OnInit {

  sttNotifi: boolean = false;
  textNotifi: string;
  sttTextNotifi: string = 'toast-success';
  sttLoading: boolean = false;
  open: any;
  id: any;
  p: any;
  alive: boolean = true;
  weeks: any = [];
  courses: any = [];

  constructor(public afs: AngularFirestore) {
    this.getDataClient();
  }

  ngOnInit(): void {
  }

  getDataClient() {
    this.afs.collection('weeks', ref => ref.orderBy('createdAt', 'desc')).valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.weeks = data;
      })
    this.afs.collection('courses', ref => ref.orderBy('createdAt', 'desc')).valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.courses = data;
      })
  }

  // search(val: any) {
  //   console.log(val);
  //   var arr = [];
  //   var data = this.permanentListDataCategories;
  //   for (let index = 0; index < data.length; index++) {
  //     var text = (data[index].name + data[index].price).toLowerCase()
  //     if (text.indexOf(val.toLowerCase()) != -1) {
  //       arr.push(data[index])
  //     }
  //   }
  //   this.listDataCategories = arr
  // }

  async deleted(id: string) {
    var confirmed = confirm('Có xóa danh mục này không?');
    if(confirmed){
      var docRef = this.afs.doc('categories/' + id);
      await  docRef.get().subscribe(async doc => {
        if(!doc.exists){
          this.sttLoading = false;
          this.sttNotifi = true;
          this.textNotifi = 'Danh mục không tồn tại.';
          this.sttTextNotifi = 'toast-error';
        } else {
          await docRef.update({status: -1}).then(async a => {
            this.sttLoading = false;
            this.sttNotifi = true;
            this.textNotifi = 'Xóa danh mục thành công';
            this.sttTextNotifi = 'toast-success';
          }).catch(er => {
            this.sttLoading = false;
            this.sttNotifi = true;
            this.textNotifi = er.msg;
            this.sttTextNotifi = 'toast-error';
          })
        }
      })
    }
  }

  getCourseName(id): string {
    for (let i = 0; i < this.courses.length; i++) {
      if(this.courses[i].id == id){
        return this.courses[i].name;
      }
    }
    return 'lỗi';
  }

  filterWeekByCourse(id) {
    this.afs.collection('weeks', ref => ref.where('courseId', '==', id)).valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.weeks = data.sort((a, b)=> {
          return  a['position'] - b['position']});
      })
  }
}
