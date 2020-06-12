import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ManageComponent} from './manage.component';
import {CourseComponent} from './course/course.component';
import {CurriculumComponent} from './curriculum/curriculum.component';


const routes: Routes = [
  {
    path: 'manage',
    component: ManageComponent,
    children: [
      {
        path: 'course',
        component: CourseComponent
      },
      {
        path: 'course/create',
        component: CourseComponent
      },
      {
        path: 'course/curriculum',
        component: CurriculumComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageRoutingModule { }
