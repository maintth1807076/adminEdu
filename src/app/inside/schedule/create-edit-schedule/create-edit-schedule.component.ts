import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Location } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-schedule',
  templateUrl: './create-edit-schedule.component.html',
  styleUrls: ['./create-edit-schedule.component.css']
})
export class CreateEditScheduleComponent implements OnInit {

  formCreated: FormGroup;
  sttNotifi: boolean = false;
  textNotifi: string;
  sttTextNotifi: string = 'toast-success';
  sttLoading: boolean = false;
  alive: boolean = true;
  idSchedule: string;
  sttAdd: boolean = true;
  categories: any = [];
  teachers: any = [];
  submitted = false;

  downloadUrl: Observable<string>;
  urls: any = [];

  ckeditorContent: string;
  
  constructor(private _location: Location, private router: Router, public afAuth: AngularFireAuth, private http: HttpClient, private fb: FormBuilder, public afs: AngularFirestore, private storage: AngularFireStorage) {
    this.createForm();
    var url = window.location.href;
    this.idSchedule = this.getParameterByName('id', url);

    if (this.idSchedule != null && this.idSchedule.length > 0) {
      afs.doc('schedules/' + this.idSchedule).get().subscribe(a => {
        if (a.exists) {
          var objCreated = [];
          objCreated['name'] = [a.data().name];
          objCreated['description'] = [a.data().description];
          objCreated['introduce'] = [a.data().introduce];
          objCreated['thumbnail'] = [a.data().thumbnail];
          objCreated['tag'] = a.data().tag.join(',');
          this.formCreated = this.fb.group(objCreated);
          this.sttAdd = false;
        } else {
          this.sttLoading = false;
          this.sttNotifi = true;
          this.textNotifi = "Không tồn tại lộ trình này";
          this.sttTextNotifi = 'toast-error';
        }

      });
    }
  }


  ngOnInit(): void {

  }



  createForm() {
    var objCreated = [];
    objCreated['name'] = new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]);
    objCreated['description'] = new FormControl('', [
      Validators.required
    ]);

    objCreated['introduce'] = new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]);
    objCreated['tag'] = new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]);
    objCreated['thumbnail'] = new FormControl('', [
      Validators.required
    ]);

    this.formCreated = this.fb.group(objCreated);
  }

  async createdSchedule() {
    console.log(this.formCreated.value.name)
    this.sttLoading = true;
    this.sttNotifi = false;
    if (!this.sttAdd) {
      this.afs.doc('schedules/' + this.idSchedule).update({
        name: this.formCreated.value.name,
        description: this.formCreated.value.description,
        introduce: this.formCreated.value.introduce,
        thumbnail: this.formCreated.value.thumbnail,
        tag: this.formCreated.value.tag.split(','),
        updatedAt: new Date().getTime()
      }).then(a => {
        this.sttLoading = false;
        this.sttNotifi = true;
        this.textNotifi = 'Sửa thành công';
        this.sttTextNotifi = 'toast-success';
        this.formCreated.reset();
      }).catch(er => {
        console.log(er);
        this.sttLoading = false;
        this.sttNotifi = true;
        this.textNotifi = er.msg;
        this.sttTextNotifi = 'toast-error';
      });
    } else {

      if(this.urls.length == 0){
        alert("Image is not selected")
        return;
      }

      this.downloadUrl.subscribe(url => {
        this.afs.collection('schedules').add({

          createdAt: new Date().getTime(),
          description: this.formCreated.value.description,
          id: '',
          name: this.formCreated.value.name,
          introduce: this.formCreated.value.introduce,
          updatedAt: new Date().getTime(),
          thumbnail: url,
          tag: this.formCreated.value.tag.split(',')
        }).then(async a => {
          await this.afs.doc('schedules/' + a.id).update({
            id: a.id
          });
          alert('them thanh cong')
          this.sttLoading = false;
          this.sttNotifi = true;
          this.textNotifi = 'Thêm thành công';
          this.sttTextNotifi = 'toast-success';
          this.formCreated.reset();
          window.location.href = '/Schedule';
        }).catch(er => {
          this.sttLoading = false;
          this.sttNotifi = true;
          this.textNotifi = er.msg;
          this.sttTextNotifi = 'toast-error';
        });
      });

    }
    // if (this.formCreated.value.categoryId.length == 0) {
    //   alert('phải chọn danh mục đã');
    //   return;
    // }
  }


  async deleted() {
    this.afs.doc('schedules/' + this.idSchedule).delete().then(a => {
      this.sttLoading = false;
      this.sttNotifi = true;
      this.textNotifi = 'Xóa thành công';
      this.sttTextNotifi = 'toast-success';
      this.formCreated.reset();
      setTimeout(() => {
        // this.router.navigate(['/book/' + this.type]);
        this._location.back();
      }, 1500);
    }).catch(er => {
      this.sttLoading = false;
      this.sttNotifi = true;
      this.textNotifi = er.msg;
      this.sttTextNotifi = 'toast-error';
    });
  }

  getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  dismissToast() {
    this.sttNotifi = false;
  }

  onRemove(event) {
    this.urls.splice(this.urls.indexOf(event), 1);
  }

  onSelect(event) {
    let files = event.addedFiles
    for (let i = 0; i < files.length; i++) {
      this.uploadFile(files[i])
    }
  }

  uploadFile(file) {
    var n = Date.now();
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadUrl = fileRef.getDownloadURL();
          this.downloadUrl.subscribe((url) => {
            if (url) {
              this.urls.push(url);
              console.log("[url]: ", url);

            }
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

}
