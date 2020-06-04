import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.css']
})
export class CreateEditCategoryComponent implements OnInit {

  formCreated: FormGroup;
  sttNotifi: boolean = false;
  textNotifi: string;
  sttTextNotifi: string = 'toast-success';
  sttLoading: boolean = false;
  id: string;
  sttAdd: boolean = true;
  constructor(private router: Router, private fb: FormBuilder, public afs: AngularFirestore) {
    this.createForm();
    var url = window.location.href;
    this.id = this.getParameterByName('id', url);
    if(this.id != null && this.id.length > 0){
        afs.doc('categories/' + this.id).get().subscribe(a => {
          var objCreated = [];
          objCreated['name'] = a.data().name;
          objCreated['arrImg'] = a.data().arrImg[0];
          objCreated['description'] = a.data().description;
          objCreated['videoIntroduce'] = a.data().videoIntroduce
          this.formCreated = this.fb.group(objCreated);
          this.sttAdd = false;
        })
    }
  }

  ngOnInit(): void {
  }

  createForm() {
    var objCreated = [];
    objCreated['name'] = '';
    objCreated['description'] = '';
    objCreated['arrImg'] = [];
    objCreated['videoIntroduce'] = '';
    this.formCreated = this.fb.group(objCreated);
  }

  async createdBook() {
    this.sttLoading = true;
    this.sttNotifi = false;
    if (!this.sttAdd) {
      this.afs.doc('categories/' + this.id).update({
        name: this.formCreated.value.name,
        description: this.formCreated.value.description,
        updatedAt: new Date().getTime(),
      }).then(a => {
        this.sttLoading = false;
        this.sttNotifi = true;
        this.textNotifi = 'Sửa thành công';
        this.sttTextNotifi = 'toast-success';
        this.formCreated.reset()
      }).catch(er => {
        this.sttLoading = false;
        this.sttNotifi = true;
        this.textNotifi = er.msg;
        this.sttTextNotifi = 'toast-error';
      })
    } else {
      this.afs.collection('categories').add({
        createdAt: new Date().getTime(),
        description: this.formCreated.value.description,
        id: "",
        name: this.formCreated.value.name,
        uidCreate: '',
        updatedAt: new Date().getTime(),
        arrImg: [this.formCreated.value.arrImg],
        videoIntroduce: this.formCreated.value.videoIntroduce,
      }).then(a => {
        this.afs.doc('categories/' + a.id).update({
          id: a.id
        })
        this.sttLoading = false;
        this.sttNotifi = true;
        this.textNotifi = 'Thêm danh mục thành công';
        this.sttTextNotifi = 'toast-success';
        this.formCreated.reset()
      }).catch(er => {
        this.sttLoading = false;
        this.sttNotifi = true;
        this.textNotifi = er.msg;
        this.sttTextNotifi = 'toast-error';
      })
    }
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

  dismissToast() {
    this.sttNotifi = false;
  }
}
