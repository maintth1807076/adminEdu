import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {takeWhile} from 'rxjs/operators';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  open: any;
  sttLoadingComplete: any;
  xetduyet: any;
  id: any;
  p: any;
  alive: boolean = true;
  listDataCategories: any = [];
  permanentListDataCategories: any = [];

  constructor(public afs: AngularFirestore) {
    this.getDataClient();
  }

  ngOnInit(): void {
  }

  getDataClient() {
    this.afs.collection('categories', ref => ref.orderBy('createdAt', 'desc')).valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        console.log(data);
        this.listDataCategories = data;
        this.permanentListDataCategories = data;
      })
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
