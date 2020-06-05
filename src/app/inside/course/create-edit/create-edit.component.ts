import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {takeWhile} from 'rxjs/operators';

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

  constructor(private _location: Location, private router: Router, public afAuth: AngularFireAuth, private http: HttpClient, private fb: FormBuilder, public afs: AngularFirestore) {
    this.createForm();
    var url = window.location.href;
    this.idCourse = this.getParameterByName('id', url);
    this.getDataClient();

    if (this.idCourse != null && this.idCourse.length > 0) {
      afs.doc('courses/' + this.idCourse).get().subscribe(a => {
        if(a.exists){
          var objCreated = [];
          objCreated['name'] = [a.data().name];
          objCreated['description'] = [a.data().description];
          objCreated['videoIntroduce'] = [a.data().videoIntroduce];
          objCreated['price'] = [a.data().price];
          objCreated['discount'] = [a.data().discount];
          objCreated['categoryId'] = [a.data().categoryId];
          objCreated['teacherIds'] = [a.data().teacherIds];
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
  }

  createForm() {
    var objCreated = [];
    objCreated['name'] = [''];
    objCreated['description'] = [''];
    objCreated['videoIntroduce'] = [''];
    objCreated['price'] = [''];
    objCreated['discount'] = [''];
    objCreated['teacherIds'] = [''];
    objCreated['categoryId'] = 0;
    this.formCreated = this.fb.group(objCreated);
  }

  async createdBook() {
    this.sttLoading = true;
    this.sttNotifi = false;
    if (!this.sttAdd) {
      this.afs.doc('courses/' + this.idCourse).update({
        videoIntroduce: this.formCreated.value.videoIntroduce,
        name: this.formCreated.value.name,
        description: this.formCreated.value.description,
        price: this.formCreated.value.price,
        teacherIds: this.formCreated.value.teacherIds,
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
      this.afs.collection('courses').add({
        categoryId: this.formCreated.value.categoryId,
        createdAt: new Date().getTime(),
        description: this.formCreated.value.description,
        id: '',
        name: this.formCreated.value.name,
        teacherIds: this.formCreated.value.teacherIds,
        price: Number(this.formCreated.value.price),
        discount: Number(this.formCreated.value.discount),
        coachingService: '',
        courseLevel: '',
        discountCode: '',
        estimatedTime: '',
        followUpRequestAccept: '',
        followUpRequestMax: '',
        updatedAt: new Date().getTime(),
        likedUserIds: '',
        thumbnail: '',
      }).then(async a => {
        await this.afs.doc('courses/' + a.id).update({
          id: a.id
        });
        this.sttLoading = false;
        this.sttNotifi = true;
        this.textNotifi = 'Thêm thành công';
        this.sttTextNotifi = 'toast-success';
        this.formCreated.reset();
      }).catch(er => {
        this.sttLoading = false;
        this.sttNotifi = true;
        this.textNotifi = er.msg;
        this.sttTextNotifi = 'toast-error';
      });
    }
  }

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
}


