import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent implements OnInit {

  id: any;
  p: any;
  alive: boolean = true;
  lessons: any = [];
  weeks: any = [];

  constructor(public afs: AngularFirestore) {
    this.getDataClient();
  }

  getDataClient() {
    this.afs.collection('lessons', ref => ref.orderBy('createdAt', 'desc')).valueChanges()
    .pipe(takeWhile(() => this.alive))
    .subscribe(data => {
      this.lessons = data;
    })
    this.afs.collection('weeks').valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.weeks = data;
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

  ngOnInit(): void {
  }

  getWeekName(id): string {
    for (let i = 0; i < this.weeks.length; i++) {
      if(this.weeks[i].id == id){
        return this.weeks[i].name;
      }
    }
    return 'lỗi';
  }

  filterLessonByWeek(id) {
    this.afs.collection('lessons', ref => ref.where('weekId', '==', id)).valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.lessons = data.sort((a, b)=> {
          return  a['position'] - b['position']});
      })
  }
}
