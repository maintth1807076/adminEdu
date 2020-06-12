import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRoutingModule } from './manage-routing.module';
import { ManageComponent } from './manage.component';
import { CourseComponent } from './course/course.component';
import { CurriculumComponent } from './curriculum/curriculum.component';


@NgModule({
  declarations: [ManageComponent, CourseComponent, CurriculumComponent],
  imports: [
    CommonModule,
    ManageRoutingModule
  ]
})
export class ManageModule { }
