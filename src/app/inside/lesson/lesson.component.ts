import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit {
  open: any;
  sttLoadingComplete: any;
  xetduyet: any;
  id: any;
  p: any;
  alive: boolean = true;
  listDataCourse: any = [];
  listDataCategories: any = [];
  permanentListDataCategories: any = [];
  courseName: string;
  courseId: string;
  constructor(public afs: AngularFirestore) { 
    var url = window.location.href;
    this.courseName = this.getParameterByName('courseName', url);
    this.courseId = this.getParameterByName('courseId', url);

    this.getDataClient();
  }

  getDataClient() {
    // this.afs.collection('courses').valueChanges()
    // .pipe(takeWhile(() => this.alive))
    // .subscribe(data => {
    //   this.listDataCourse = data;
    // })
    // this.dataAgency = this.afs.collection<ItemClient>('ID', ref => ref.where('statusProcessing', '==', 0));
    this.afs.collection('weeks', ref => ref
      .orderBy('createdAt', 'desc')).valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        console.log(data);
        this.listDataCategories = data;
        this.permanentListDataCategories = data;
      })
  }
 getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';

    console.log(decodeURIComponent(results[2].replace(/\+/g, ' ')));
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
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
  ngOnInit(): void {
  }

}
