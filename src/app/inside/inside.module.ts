import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsideRoutingModule } from './inside-routing.module';
import { InsideComponent } from './inside.component';
import { CategoryComponent } from './category/category.component';
import { CourseComponent } from './course/course.component';
import { LessonComponent } from './lesson/lesson.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {CreateEditCategoryComponent} from './category/create-edit/create-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DetailCategoryComponent} from './category/detail/detail.component';
import {CreateEditCourseComponent} from './course/create-edit/create-edit.component';
import {DetailCourseComponent} from './course/detail/detail.component';
import {CreateEditLessonComponent} from './lesson/create-edit/create-edit.component';
import {CreateEditTeacherComponent} from './teacher/create-edit/create-edit.component';
import {DetailLessonComponent} from './lesson/detail/detail.component';
import { TeacherComponent } from './teacher/teacher.component';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SyllabusComponent } from './syllabus/syllabus.component';
import { CreateEditSyllabusComponent } from './syllabus/create-edit/create-edit.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WeekComponent } from './week/week.component';
import {CreateEditWeekComponent} from './week/create-edit/create-edit.component';

@NgModule({
  declarations: [InsideComponent, CategoryComponent, CourseComponent, LessonComponent, CreateEditCategoryComponent, DetailCategoryComponent, CreateEditCourseComponent, DetailCourseComponent, CreateEditLessonComponent, CreateEditTeacherComponent, DetailLessonComponent, TeacherComponent, SyllabusComponent, CreateEditSyllabusComponent, WeekComponent, CreateEditWeekComponent],
  exports: [
    InsideComponent,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
  imports: [
    CommonModule,
    InsideRoutingModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    MatCheckboxModule,
    FormsModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class InsideModule { }
