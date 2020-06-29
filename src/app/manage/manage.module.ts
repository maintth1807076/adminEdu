import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageRoutingModule } from './manage-routing.module';
import { ManageComponent } from './manage.component';
import { CourseComponent } from './course/course.component';
import { CurriculumComponent } from './curriculum/curriculum.component';
import { ScheduleComponent } from './schedule/schedule.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
@NgModule({
  declarations: [ManageComponent, CourseComponent, CurriculumComponent, ScheduleComponent],
  imports: [
    CommonModule,
    ManageRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    FormsModule
  ]
})
export class ManageModule { }
