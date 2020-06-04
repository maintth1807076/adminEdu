import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import {CreateEditCategoryComponent} from './category/create-edit/create-edit.component';
import {DetailCategoryComponent} from './category/detail/detail.component';
import {CourseComponent} from './course/course.component';
import {CreateEditCourseComponent} from './course/create-edit/create-edit.component';
import {DetailCourseComponent} from './course/detail/detail.component';
import {LessonComponent} from './lesson/lesson.component';
import {CreateEditLessonComponent} from './lesson/create-edit/create-edit.component';
import {DetailLessonComponent} from './lesson/detail/detail.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'category',
        component: CategoryComponent
      },
      {
        path: 'category/create-edit',
        component: CreateEditCategoryComponent
      },
      {
        path: 'category/:id',
        component: DetailCategoryComponent
      },
      {
        path: 'course',
        component: CourseComponent
      },
      {
        path: 'course/create-edit',
        component: CreateEditCourseComponent
      },
      {
        path: 'course/:id',
        component: DetailCourseComponent
      },
      {
        path: 'lesson',
        component: LessonComponent
      },
      {
        path: 'lesson/create-edit',
        component: CreateEditLessonComponent
      },
      {
        path: 'category/:id',
        component: DetailLessonComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsideRoutingModule { }
