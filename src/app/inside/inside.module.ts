import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsideRoutingModule } from './inside-routing.module';
import { InsideComponent } from './inside.component';
import { CategoryComponent } from './category/category.component';
import { CourseComponent } from './course/course.component';
import { LessonComponent } from './lesson/lesson.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {CreateEditCategoryComponent} from './category/create-edit/create-edit.component';
import {ReactiveFormsModule} from '@angular/forms';
import {DetailCategoryComponent} from './category/detail/detail.component';
import {CreateEditCourseComponent} from './course/create-edit/create-edit.component';
import {DetailCourseComponent} from './course/detail/detail.component';
import {CreateEditLessonComponent} from './lesson/create-edit/create-edit.component';
import {CreateEditTeacherComponent} from './teacher/create-edit/create-edit.component';
import {DetailLessonComponent} from './lesson/detail/detail.component';
import { TeacherComponent } from './teacher/teacher.component';
import {MatSelectModule} from '@angular/material/select';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [InsideComponent, CategoryComponent, CourseComponent, LessonComponent, CreateEditCategoryComponent, DetailCategoryComponent, CreateEditCourseComponent, DetailCourseComponent, CreateEditLessonComponent, CreateEditTeacherComponent, DetailLessonComponent, TeacherComponent],
  imports: [
    CommonModule,
    InsideRoutingModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ]
})
export class InsideModule { }
