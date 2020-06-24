import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { takeWhile } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurriculumComponent implements OnInit {

  id: any;
  p: any;
  alive: boolean = true;
  listDataCategories: any = [];
  permanentListDataCategories: any = [];
  permanentListDataCategories1: any = [];
  idDoc: any;
  nameDoc: string;

  courseId: string
  weeks: any = [];
  lessons: any = [];
  less = [];

  constructor(
    private afs: AngularFirestore,
    private change: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    let url = window.location.href;
    this.courseId = this.getParameterByName('courseId', url);
    this.idDoc = this.getParameterByName('id', url);
    this.nameDoc = this.getParameterByName('name', url);
    this.getDataClient();
  }

 getDataClient() {
    this.afs.collection('weeks', ref => ref.where('courseId', '==', this.courseId)).valueChanges().subscribe(data => {
        this.weeks = data.sort((a, b) => {
          return a['position'] - b['position']
        })
    });
    this.afs.collection('courses', ref => ref.orderBy('createdAt', 'desc')).valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.listDataCategories = data;
        this.permanentListDataCategories1 = data;
        this.permanentListDataCategories = data;
        if (this.idDoc != null && this.idDoc.length > 0) {
          this.filterByCategory(this.idDoc);
        }
        
      })
  }

  getLesson(id) {
    console.log("[id lessoon]", id);
    // this.lessons = this.afs.collection('lessons',ref => ref.where('weekId', '==', this.idDoc)).valueChanges;
    this.afs.collection('lessons', ref => ref.where('weekId', '==', id)).valueChanges().subscribe(data => {
      console.log("data lesson ", data);
      this.lessons = data.sort((a, b) => {
        return a['position'] - b['position']
      });
    })
  }

  getWeekId(id) {
    this.afs.collection('lessons', ref => ref.where('weekId', '==', id)).valueChanges().subscribe(data => {
      console.log("data", data);
      this.less = data.sort((a, b) => {
        return a['position'] - b['position']
      });
    });
    // this.getLesson(id);
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


  filterByCategory(val) {
    if (val == 'all') {
      this.listDataCategories = this.permanentListDataCategories1;
      return;
    }
    var arr = [];
    var data = this.permanentListDataCategories1;
    for (let index = 0; index < data.length; index++) {
      if (data[index].categoryId == val) {
        arr.push(data[index]);
      }
    }
    this.listDataCategories = arr;
    this.permanentListDataCategories = arr;
  }
}
