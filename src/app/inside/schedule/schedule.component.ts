import { Component, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  id: any;
  p: any;
  alive: boolean = true;
  categories: any = [];
  teachers: any = [];
  listDataSchedules: any = [];
  permanentListData: any = [];
  idDoc: any;
  nameDoc: string;
  constructor(public afs: AngularFirestore) {
    var url = window.location.href;
    this.idDoc = this.getParameterByName('id', url);
    this.nameDoc = this.getParameterByName('name', url);
    this.getDataClient();
  }
  getDataClient() {
    
    this.afs.collection('schedules', ref => ref.orderBy('createdAt', 'desc')).valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.listDataSchedules = data;
        this.permanentListData = data;
        if (this.idDoc != null && this.idDoc.length > 0) {
          var arr = [];
          this.listDataSchedules = arr;
          
        }
      })
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
    var data = this.permanentListData;
    for (let index = 0; index < data.length; index++) {
      var text = (data[index].name + data[index].price).toLowerCase()
      if (text.indexOf(val.toLowerCase()) != -1) {
        arr.push(data[index])
      }
    }
    this.listDataSchedules = arr
  }

}
