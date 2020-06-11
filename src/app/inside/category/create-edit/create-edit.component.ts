import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.css']
})
export class CreateEditCategoryComponent implements OnInit {

  urls: any = [];
  downloadURL: Observable<string>;
  formCreated: FormGroup;
  sttNotifi: boolean = false;
  textNotifi: string;
  sttTextNotifi: string = 'toast-success';
  sttLoading: boolean = false;
  id: string;
  sttAdd: boolean = true;
  constructor(private storage: AngularFireStorage, private router: Router, private fb: FormBuilder, public afs: AngularFirestore) {
    this.createForm();
    var url = window.location.href;
    this.id = this.getParameterByName('id', url);
    if(this.id != null && this.id.length > 0){
        afs.doc('categories/' + this.id).get().subscribe(a => {
          var objCreated = [];
          objCreated['name'] = a.data().name;
          this.urls = a.data().arrImg;
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
        arrImg: this.urls,
        videoIntroduce: this.formCreated.value.videoIntroduce,
        updatedAt: new Date().getTime(),
      }).then(a => {
        this.sttLoading = false;
        this.sttNotifi = true;
        this.textNotifi = 'Sửa thành công';
        this.sttTextNotifi = 'toast-success';
        this.formCreated.reset()
        this.urls = null;
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
        arrImg: this.urls,
        videoIntroduce: this.formCreated.value.videoIntroduce,
        status: 1
      }).then(a => {
        this.afs.doc('categories/' + a.id).update({
          id: a.id
        })
        alert('thêm thành công');
        this.sttLoading = false;
        this.sttNotifi = true;
        this.textNotifi = 'Thêm danh mục thành công';
        this.sttTextNotifi = 'toast-success';
        this.formCreated.reset()
        this.urls = null;
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

  onSelect(event) {
    let files = event.addedFiles
    for (let i = 0; i < files.length; i++) {
      this.uploadFile(files[i])
    }
  }
  onRemove(event) {
    this.urls.splice(this.urls.indexOf(event), 1);
  }
  uploadFile(file) {
    var n = Date.now();
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.urls.push(url);
            }
          });
        })
      )
      .subscribe(url => {
        if (url) {
        }
      });
  }
}
