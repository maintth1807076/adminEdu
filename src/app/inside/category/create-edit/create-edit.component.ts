import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.css']
})
export class CreateEditCategoryComponent implements OnInit {

  constructor(public afs: AngularFirestore) {

  }

  ngOnInit(): void {
  }

}
