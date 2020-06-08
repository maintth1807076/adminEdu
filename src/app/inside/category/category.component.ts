import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {takeWhile} from 'rxjs/operators';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  sttNotifi: boolean = false;
  textNotifi: string;
  sttTextNotifi: string = 'toast-success';
  sttLoading: boolean = false;
  open: any;
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
}
