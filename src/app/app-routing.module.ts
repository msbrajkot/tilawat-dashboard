import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './dashboard/home/home.component';
import { ReportsComponent } from './students/reports/reports.component';
import { studentRoutes } from './shared/appConfig';
import { ListStudentsComponent } from './students/list-students/list-students.component';
import { ViewStudentComponent } from './students/view-student/view-student.component';
import { AddTilawatComponent } from './students/add-tilawat/add-tilawat.component';

const routes: Routes = [
  {
    path: "", component: HomeComponent,
    children: [
      { path: "", component: ReportsComponent },
      {path: `${studentRoutes.Base}/${studentRoutes.List}`, component: ListStudentsComponent},
      {path: `${studentRoutes.Base}/${studentRoutes.Add}`, component: AddTilawatComponent},
      {path: `${studentRoutes.Base}/${studentRoutes.View}/:studentId`, component: ViewStudentComponent},
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
