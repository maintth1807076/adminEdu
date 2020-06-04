import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsideRoutingModule } from './inside-routing.module';
import { InsideComponent } from './inside.component';
import { CategoryComponent } from './category/category.component';
import { CourseComponent } from './course/course.component';
import { LessonComponent } from './lesson/lesson.component';


@NgModule({
  declarations: [InsideComponent, CategoryComponent, CourseComponent, LessonComponent],
  imports: [
    CommonModule,
    InsideRoutingModule
  ]
})
export class InsideModule { }
