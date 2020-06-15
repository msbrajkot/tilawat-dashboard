import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { DataTableDirective } from "angular-datatables";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { Student } from 'src/app/shared/models/Student';
import { StudentService } from 'src/app/shared/services/student.service';
import { studentRoutes } from 'src/app/shared/appConfig';


@Component({
  selector: 'app-list-students',
  templateUrl: './list-students.component.html',
  styleUrls: ['./list-students.component.css']
})
export class ListStudentsComponent implements OnInit,AfterViewInit, OnDestroy {

  /* #region  Global variables */
  // Datatable properties..
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  timerSubscription: Subscription;
  students: Student[];
  /* #endregion */
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private studentService: StudentService
  ) { }

  ngOnInit() {
    //Set Datatable options.
    this.dtOptions = {
      pagingType: "full_numbers",
      pageLength: 10,
      autoWidth: true,
      responsive: false,
      processing: true,
    };

    this.getStudents();

  }

  getStudents() {
    console.log("getStudents method called");
    this.studentService.getStudents()
      .subscribe(
        (res) => {
          console.log("Fetched students: ", JSON.stringify(res));
          if (res != null) {
            this.students = res;
            this.rerender();
          }
          else {
            this.toastr.error("Failed to Fetch Students.", "Error");
          }
        },
        (error) => {
          // On Error.
          console.error("Service Failure", error);
          // Toaster Error: Failed to fetch students.
          this.toastr.error(error, "Service Failure");
        }
      )
  }

  addTilawat(){
    this.router.navigate([`${studentRoutes.Base}/${studentRoutes.Add}`]);
  }
  viewStudent(studentId: string){
    this.router.navigate([`${studentRoutes.Base}/${studentRoutes.View}`,studentId]);
  }

  // deleteStudent(student: Student){
  //   Swal.fire({
  //     title: `Delete ${student.name} ?`,
  //     text: "You will not be able to recover this student!",
  //     type: "question",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, delete it!",
  //     cancelButtonText: "No, keep it"
  //   }).then(result => {
  //     if (result.value) {
        
  //       this.studentService.deleteStudent(student._id).subscribe(
  //         (res) => {
  //           console.log("Success Output : " + JSON.stringify(res));
  //           if (res!= null) {
  //             // Remove row from table.
  //             this.students = this.students.filter(({_id}) => _id !== student._id);
  //             console.log("Removed student from table.");
  //             this.rerender();
              
  //             // Success message through swal or toaster.
  //             Swal.fire(
  //               "Deleted!",
  //               `${student.name} has been deleted.`,
  //               "success"
  //             );
  //           } else {
  //             // Toaster Erorr message.
  //             this.toastr.error(`Failed to delete ${student.name}.`, "Error");
  //           }
  //         },
  //         error => {
  //           // On Error.
  //           console.error("Service Failure", error);
  //           // Toaster Error: Failed to fetch consumer.
  //           this.toastr.error(error, "Service Failure");
  //         }
  //       );
  //       // For more information about handling dismissals please visit
  //       // https://sweetalert2.github.io/#handling-dismissals
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       Swal.fire("Cancelled", "Student is not deleted.", "error");
  //     }
  //   });
  // }

  

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

}
