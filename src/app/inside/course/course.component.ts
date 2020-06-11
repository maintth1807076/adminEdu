import { Component, OnInit } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  id: any;
  p: any;
  alive: boolean = true;
  categories: any = [];
  teachers: any = [];
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
    this.afs.collection('categories').valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.categories = data;
      })
    this.afs.collection('teachers').valueChanges()
      .pipe(takeWhile(() => this.alive))
      .subscribe(data => {
        this.teachers = data;
      })
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

  createRate(id: any) {
        this.afs.collection('ratings').add({
          courseId: id,
          createdAt: new Date().getTime(),
          comment: "Sau khóa học tôi có thêm nhiều kiến thức. Khóa học thật sự tuyệt vời.",
          userId: "dangkhanhttty@gmail.com",
          star: 4
        })
  }

  createFaq(id: any) {
    this.afs.collection('faqs').add({
      courseId: id,
      createdAt: new Date().getTime(),
      question: "Làm sao để đăng kí coaching 1-1?",
      answer: "Bạn vui lòng gửi request coaching 1-1.",
      creator: "dangkhanhttty@gmail.com"
    })
  }

  createCourse(id: any) {
      this.afs.doc('courses/' + id).update({
        level: "Phù hợp với hầu hết tất cả mọi người",
        benefit: "Với những bạn 21 ngày đầu tích cực điểm danh, nếu ở tuần cuối cùng vẫn còn gặp khó khăn, sẽ được thầy hỗ trợ trong nhóm để làm ví dụ",
        updatedAt: new Date().getTime(),
      })
  }

  createWeek(id: any) {
    this.afs.collection('weeks').add({
      courseId: id,
      createdAt: new Date().getTime(),
      description: "Văn học và giá trị",
      position: 1
      // description: "Giới thiệu chung",
      // position: 0
    }).then(a => {
      this.afs.doc('weeks/' + a.id).update({
        id: a.id
      })
    })
  }

  getCategoryName(id): string {
    for (let i = 0; i < this.categories.length; i++) {
      if(this.categories[i].id == id){
        return this.categories[i].name;
      }
    }
    return 'lỗi';
  }

  getTeacherName(id): string {
    for (let i = 0; i < this.teachers.length; i++) {
      if(this.teachers[i].id == id){
        return this.teachers[i].name;
      }
    }
    return 'lỗi';
  }
}
