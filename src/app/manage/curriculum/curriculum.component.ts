import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-curriculum',
  templateUrl: './curriculum.component.html',
  styleUrls: ['./curriculum.component.css']
})
export class CurriculumComponent implements OnInit {

  courseId: string
  weeks: any = []
  lessons: any = []

  constructor(private afs: AngularFirestore) { }

  ngOnInit(): void {
    let url = window.location.href;
    this.courseId = this.getParameterByName('courseId', url);
    this.getDataClient();
  }

  getDataClient() {
    this.afs.collection('weeks', ref => ref.where('courseId', '==', this.courseId)).valueChanges().subscribe(data => {
      this.weeks = data.sort((a, b) => {
        return a['position'] - b['position']
      });
    })
  }

  getLesson(id) {
    this.afs.collection('lessons', ref => ref.where('weekId', '==', id)).valueChanges().subscribe(data => {
      this.lessons = data.sort((a, b) => {
        return a['position'] - b['position']
      });
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

}
