import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  open: any;
  sttLoadingComplete: any;
  xetduyet: any;
  id: any;
  p: any;
  alive: boolean = true;
  // listCategories: any = [];
  listDataCategories: any = [];
  permanentListDataCategories: any = [];
  permanentListDataCategories1: any = [];
  idDoc: any;
  nameDoc: string;
  constructor(public afs: AngularFirestore) { 
    var url = window.location.href;
    this.idDoc = this.getParameterByName('id', url);
    this.nameDoc = this.getParameterByName('name', url);
    this.getDataClient();
  }
  getDataClient() {
    // this.afs.collection('categories').valueChanges()
    //   .pipe(takeWhile(() => this.alive))
    //   .subscribe(data => {
    //     this.listCategories = data;
    //   })

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
  filterByCategory(val) {
    if(val == 'all'){
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
  ngOnInit(): void {
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
  search(val: any) {
    console.log(val);
    var arr = [];
    var data = this.permanentListDataCategories;
    for (let index = 0; index < data.length; index++) {
      var text = (data[index].name + data[index].price).toLowerCase()
      if (text.indexOf(val.toLowerCase()) != -1) {
        arr.push(data[index])
      }
    }
    this.listDataCategories = arr
  }

}
