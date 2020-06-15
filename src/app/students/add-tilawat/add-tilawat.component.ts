import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from '@angular/router';
import { Tilawat } from 'src/app/shared/models/Tilawat';
import { StudentService } from 'src/app/shared/services/student.service';
import { surats, studentRoutes } from 'src/app/shared/appConfig';

@Component({
  selector: 'app-add-tilawat',
  templateUrl: './add-tilawat.component.html',
  styleUrls: ['./add-tilawat.component.css']
})
export class AddTilawatComponent implements OnInit {

  /* #region  Global Variables */
  tilawatForm: FormGroup;
  isSubmitted: boolean = false;
  disableSubmit: boolean = false;
  newTilawat: Tilawat;
  students: []
  suratNames;
  pageTitle: string = " Add Tilawat";
  /* #endregion */

  constructor(
    private formBuilder: FormBuilder,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    this.tilawatForm = this.formBuilder.group({
      date: ["", Validators.required],
      student: ["", Validators.required],
      suratName: ["", Validators.required],
      startAyat: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      endAyat: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      // ayatCount: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      juzFinished: ["", Validators.required]
    });

    this.getStudents();

    this.getSurats();

  }

  // convenience getter for easy access to form fields. For fetching error on HTML side.
  get f() {
    return this.tilawatForm.controls;
  }

  getStudents() {
    console.log("getStudents method called");
    this.studentService.getStudents()
      .subscribe(
        (res) => {
          console.log("Fetched students: ", JSON.stringify(res));
          if (res != null) {

            this.students = res.map((s) => ({
              id: s._id,
              text: `${s.itsId} - ${s.firstName} ${s.lastName}`,
            }));

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

  getSurats() {
    this.suratNames = surats.map(name => ({
      id: name,
      text: name
    }));

    console.log("SuratName", this.suratNames);
    

  }

  listStudents(){
    this.router.navigate([`${studentRoutes.Base}/${studentRoutes.List}`]);
  }

  onSubmit(){
    this.isSubmitted = true;
    var formValues = this.tilawatForm.value;
    if (this.tilawatForm.invalid) {
      console.log("Failed" + JSON.stringify(formValues));
      console.log(
        "Failed" + JSON.stringify(this.tilawatForm.controls.getError)
      );
      return;
    }
    this.disableSubmit = true;
    this.newTilawat = {
      date: formValues.date,
      suratName: formValues.suratName[0].text,
      startAyat: formValues.startAyat,
      endAyat: formValues.endAyat,
      ayatCount: formValues.endAyat - formValues.startAyat + 1,
      juzFinished: formValues.juzFinished == "true" ? true : false
    }
    var studentId = formValues.student[0].id;
    this.studentService.addTilawat(studentId,this.newTilawat).subscribe(
      (out) => {
        if (out != null) {
          this.toastr.success("Tilawat added successfully", "Success");
          console.log("add tilawat output", JSON.stringify(out));
          
          this.onReset();
        } else {
           //Toaster Error message.
           this.toastr.error("Failed to add tilwat", "Failure");
        }
      },
      (error) => {
        //On Error.
        console.error("Service Failure", error);
        //Toaster Error
        this.toastr.error(error, "Service Failure");
      }
    );
  }

  // Method : Reset Form.
  onReset() {
    this.isSubmitted = false;
    this.disableSubmit = false;
    this.tilawatForm.reset();
  }
}
