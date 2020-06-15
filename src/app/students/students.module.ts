import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports/reports.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SelectModule } from 'ng2-select';
import { DataTablesModule } from 'angular-datatables';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import {  ChartsModule } from 'ng2-charts';

import { ListStudentsComponent } from './list-students/list-students.component';
import { ViewStudentComponent } from './view-student/view-student.component';
import { AddTilawatComponent } from './add-tilawat/add-tilawat.component';

@NgModule({
  declarations: [
    ListStudentsComponent, 
    ViewStudentComponent, 
    AddTilawatComponent, 
    ReportsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SweetAlert2Module,
    SelectModule,
    DataTablesModule,
    BrowserAnimationsModule,
    ToastrModule,
    ChartsModule
  ],
  exports:[
    ReportsComponent
  ]
})
export class StudentsModule { }
