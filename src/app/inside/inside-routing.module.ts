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
import {CreateEditTeacherComponent} from './teacher/create-edit/create-edit.component';
import {TeacherComponent} from './teacher/teacher.component';
import {CreateEditSyllabusComponent} from './syllabus/create-edit/create-edit.component';
import {WeekComponent} from './week/week.component';
import {CreateEditWeekComponent} from './week/create-edit/create-edit.component';

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
        path: 'lesson/:id',
        component: DetailLessonComponent
      },
      {
        path: 'teacher',
        component: TeacherComponent
      },
      {
        path: 'teacher/create-edit',
        component: CreateEditTeacherComponent
      },
      {
        path: 'week',
        component: WeekComponent
      },
      {
        path: 'week/create-edit',
        component: CreateEditWeekComponent
      },
      {
        path: 'syllabus/create-edit',
        component: CreateEditSyllabusComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsideRoutingModule { }
