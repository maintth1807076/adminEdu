import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { takeWhile, finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

enum CourseStatus {
  FollowUp = 2,
  Coaching_1_1 = 1
}

@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.css'],
  animations: []

})
export class CreateEditCourseComponent implements OnInit {


  formCreated: FormGroup;
  sttNotifi: boolean = false;
  textNotifi: string;
  sttTextNotifi: string = 'toast-success';
  sttLoading: boolean = false;
  alive: boolean = true;
  idCourse: string;
  sttAdd: boolean = true;
  categories: any = [];
  teachers: any = [];
  downloadURL: Observable<string>;
  downloadVidURL: Observable<string>;
  urls: any = [];
  urlVid: any = [];
  submitted = false;

  ckeditorContent: string;

  constructor(private _location: Location, private router: Router, public afAuth: AngularFireAuth, private http: HttpClient, private fb: FormBuilder, public afs: AngularFirestore, private storage: AngularFireStorage) {
    this.createForm();
    var url = window.location.href;
    this.idCourse = this.getParameterByName('id', url);
    this.getDataClient();

    if (this.idCourse != null && this.idCourse.length > 0) {
      afs.doc('courses/' + this.idCourse).get().subscribe(a => {
        if (a.exists) {
          var objCreated = [];
          objCreated['name'] = [a.data().name];
          objCreated['description'] = [a.data().description];
          objCreated['videoIntroduce'] = [a.data().videoIntroduce];
          objCreated['price'] = [a.data().price];
          objCreated['discount'] = [a.data().discount];
          objCreated['categoryId'] = [a.data().categoryId];
          objCreated['teacherIds'] = [a.data().teacherIds];
          objCreated['introduce'] = [a.data().introduce];
          objCreated['thumbnail'] = [a.data().thumbnail];
          objCreated['followUpRequestMax'] = [a.data().followUpRequestMax];
          objCreated['benefit'] = [a.data().benefit];
          objCreated['level'] = [a.data().level];
          objCreated['tag'] = a.data().tag.join(',');
          this.formCreated = this.fb.group(objCreated);
          this.sttAdd = false;
        } else {
          this.sttLoading = false;
          this.sttNotifi = true;
          this.textNotifi = "Không tồn tại khóa học này";
          this.sttTextNotifi = 'toast-error';
        }

      });
    }
  }

  getDataClient() {
    this.afs.collection('categories').valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.categories = data;
      });
    this.afs.collection('teachers').valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.teachers = data;
      });
  }

  ngOnInit(): void {
    var x = CourseStatus;
    var options = Object.keys(CourseStatus);
    this.options = options.slice(options.length / 2);
  }
  options: string[];
  myValue: CourseStatus;
  CourseStatus: typeof CourseStatus = CourseStatus;
  parseValue(value: string) {
    this.myValue = CourseStatus[value];
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
    objCreated['videoIntroduce'] = new FormControl('', [
      Validators.required
    ]);
    objCreated['price'] = new FormControl('', [
      Validators.required
    ]);
    objCreated['discount'] = [''];
    objCreated['teacherIds'] = new FormControl('', [
      Validators.required
    ]);
    objCreated['courseStatus'] = new FormControl('', [
      Validators.required
    ]);
    objCreated['categoryId'] = new FormControl('', [
      Validators.required,
    ]);
    objCreated['benefit'] = new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]);
    objCreated['level'] = new FormControl('', [
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
    objCreated['followUpRequestMax'] = '';
    this.formCreated = this.fb.group(objCreated);
  }

  async createdBook() {
    // let abc = this.formCreated.value.description
    console.log(this.formCreated.value.description)
    this.sttLoading = true;
    this.sttNotifi = false;
    if (!this.sttAdd) {
      this.afs.doc('courses/' + this.idCourse).update({
        videoIntroduce: this.formCreated.value.videoIntroduce,
        name: this.formCreated.value.name,
        description: this.formCreated.value.description,
        introduce: this.formCreated.value.introduce,
        thumbnail: this.formCreated.value.thumbnail,
        price: this.formCreated.value.price,
        teacherIds: this.formCreated.value.teacherIds,
        courseStatus: this.formCreated.value.courseStatus,
        discount: Number(this.formCreated.value.discount),
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
      if(this.urlVid.length == 0 || this.urls.length == 0) {
        
          alert("Video or Image not selected.")
          return;
      } 
      
        this.downloadVidURL.subscribe(urlVid => {
          this.downloadURL.subscribe(url => {
            this.afs.collection('courses').add({
              categoryId: this.formCreated.value.categoryId,
              createdAt: new Date().getTime(),
              description: this.formCreated.value.description,
              id: '',
              name: this.formCreated.value.name,
              introduce: this.formCreated.value.introduce,
              videoIntroduce: urlVid,
              teacherIds: this.formCreated.value.teacherIds,
              courseStatus: this.formCreated.value.courseStatus,
              followUpRequestMax: this.formCreated.value.followUpRequestMax,
              price: this.formCreated.value.price,
              discount: this.formCreated.value.discount,
              coachingService: true,
              level: this.formCreated.value.level,
              benefit: this.formCreated.value.benefit,
              discountCode: 'ABCD123',
              followUpRequestAccept: true,
              updatedAt: new Date().getTime(),
              likedUserIds: '',
              thumbnail: url,
              tag: this.formCreated.value.tag.split(',')
            }).then(async a => {
              await this.afs.doc('courses/' + a.id).update({
                id: a.id
              });
              alert('them thanh cong')
              this.sttLoading = false;
              this.sttNotifi = true;
              this.textNotifi = 'Thêm thành công';
              this.sttTextNotifi = 'toast-success';
              this.formCreated.reset();
              window.location.href = '/course';
            }).catch(er => {
              this.sttLoading = false;
              this.sttNotifi = true;
              this.textNotifi = er.msg;
              this.sttTextNotifi = 'toast-error';
            });
          })
        });
      
    }
    // if (this.formCreated.value.categoryId.length == 0) {
    //   alert('phải chọn danh mục đã');
    //   return;
    // }
  }

  // htmlSpecialChars(str){
  //   if(typeof(str) == "string"){
  //     str = str.replace(/&/g, "&");
	// 	str = str.replace(/"/g, '"');
	// 	str = str.replace(/'/g, "'");
	// 	str = str.replace(/</g, "<");
	// 	str = str.replace(/>/g, ">");
  //   }
  //   return str;
  // }

  async deleted() {
    this.afs.doc('courses/' + this.idCourse).delete().then(a => {
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
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe((url) => {
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

  onSelected(event) {
    let files = event.addedFiles
    for (let i = 0; i < files.length; i++) {
      this.uploadVideo(files[i])
    }
  }

  uploadVideo(file) {
    var n = Date.now();
    const filePath = `RoomsVideos/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadVidURL = fileRef.getDownloadURL();
          this.downloadVidURL.subscribe((urlVid) => {
            if (urlVid) {
              this.urlVid.push(urlVid);
              console.log("[urlVideo]: ", urlVid);

            }
          });
        })
      )
      .subscribe(urlVid => {
        if (urlVid) {
          console.log(urlVid);
        }
      });
  }

  onRemoveVid(event) {
    this.urlVid.splice(this.urlVid.indexOf(event), 1);
  }

}