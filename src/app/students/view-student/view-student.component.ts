import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject, Subscription } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";
import { Tilawat } from 'src/app/shared/models/Tilawat';
import { Student } from 'src/app/shared/models/Student';
import { StudentService } from 'src/app/shared/services/student.service';
import { studentRoutes } from 'src/app/shared/appConfig';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {

  /* #region  Global Variables */
  // Datatable Properties
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  timerSubscription: Subscription;
  tilawats: Tilawat[];
  student: Student;
  /* #endregion */

  constructor(
    private studentService : StudentService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    //Set Datatable options.
    this.dtOptions = {
      // pagingType: "full_numbers",
      pageLength: 10,
      autoWidth: true,
      processing: true,
      paging: false
    };
    // Fetch Student.
    this.route.paramMap.subscribe((params) => {
      const studentId = params.get("studentId");
      console.log("route param", studentId);
      if (studentId != null) {
        console.log("calling get studentBy id");
        this.getStudentById(studentId);
      }
    });
  }

  /* #region  Datatable related methods */
  // Method: Refreshes the datatable.
  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first in the current context
      dtInstance.destroy();

      // Call the dtTrigger to rerender again
      this.dtTrigger.next();

    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
  /* #endregion */

  getStudentById(studentId: string) {
    console.log("Inside getStudentByID", studentId);
    this.studentService.getStudentById(studentId).subscribe(
      (res) => {
        if (res != null) {
          console.log("fetched by ID", JSON.stringify(res));
          this.student = res;
          this.tilawats = res.tilawatsDone;
         this.rerender();
        } else {
          this.toastr.error("Failed to fetch Student", "Error");
        }
      },
      (error) => {
        this.toastr.error("Service Failure", "Error");
      }
    )
  }

  listStudents(){
    this.router.navigate([`${studentRoutes.Base}/${studentRoutes.List}`]);
  }
}
