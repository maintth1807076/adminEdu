import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute} from '@angular/router';
import {takeWhile} from 'rxjs/operators';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailCategoryComponent implements OnInit {

  idCategory: string;
  id: any;
  p: any;
  category: any = {};
  courses: any = [];
  alive: boolean = true;
  constructor(public afs: AngularFirestore, private route: ActivatedRoute) {
    this.idCategory = this.route.snapshot.paramMap.get('id');
    if(this.idCategory != null && this.idCategory.length > 0){
      this.getDetail(this.idCategory);
      this.getCourses(this.idCategory)
    }
  }

  ngOnInit(): void {
  }

  getDetail(id){
    this.afs.collection('categories').doc(id).get().pipe(takeWhile(() => this.alive))
      .subscribe(doc => {
        this.category = doc.data()
      })
  }

  getCourses(id){
    this.afs.collection('courses', ref => ref.where('categoryId', '==', id)).valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.courses = data;
      })
  }
}
