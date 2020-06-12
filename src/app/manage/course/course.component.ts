import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  courses: any = []
  constructor(private afs: AngularFirestore) {
    this.getDataCLient()
  }

  ngOnInit(): void {
  }

  getDataCLient() {
    this.afs.collection('courses').valueChanges().subscribe(data => {
      this.courses = data;
    })
  }
}
