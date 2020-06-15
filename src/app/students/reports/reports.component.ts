import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { reportTypeList } from 'src/app/shared/appConfig';
import { StudentService } from 'src/app/shared/services/student.service';
import { ToastrService } from 'ngx-toastr';
import { Student } from 'src/app/shared/models/Student';
import { JitSummaryResolver } from '@angular/compiler';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  /* #region  Global Variables */
  reportTypes = reportTypeList
  report;
  studentsList: [];
  students: Student[];
  selectedStudent: Student[];
  juzCountOverall: number = 0;
  ayatCountOverall: number = 0;
  juzCountIndividual: number = 0;
  ayatCountIndividual: number = 0;
  /* #endregion */

  /* #region  Day Wise Ayat Count Report */
  public dayWiseChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    },
    legend:{
      position:"bottom"
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{}], yAxes: [{
        ticks: {
          beginAtZero: true,
        },
      }]
    },
  };
  public dayWiseChartLabels: Label[] = []
  public dayWiseChartType: ChartType = 'line';
  public dayWiseChartLegend = true;
  public dayWiseChartPlugins = [pluginDataLabels];
  public dayWiseChartData: ChartDataSets[] = [];
  /* #endregion */

  /* #region  Student Wise Juz Count Report */
  public studentWiseJuzChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      
      }
    },
    legend:{
      position:"bottom"
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{}],
      yAxes: [{ticks: {
        beginAtZero: true,
      }, }]
    },
  };
  public studentWiseJuzChartLabels: Label[] = []
  public studentWiseJuzChartType: ChartType = 'bar';
  public studentWiseJuzChartLegend = true;
  public studentWiseJuzChartPlugins = [pluginDataLabels];
  public studentWiseJuzChartData: ChartDataSets[] = [];
  /* #endregion */
  constructor(
    private studentService: StudentService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
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
            this.studentsList = res.map((s) => ({
              id: s._id,
              text: `${s.itsId} - ${s.firstName} ${s.lastName}`,
            }));
            this.generateOverallReport();

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

  updateStudentReport(selected: any) {
    console.log("change", selected);
    this.ayatCountIndividual = 0;
    this.juzCountIndividual = 0;
    this.selectedStudent = this.students.filter(s => s._id == selected.id);
    this.juzCountIndividual = this.selectedStudent[0].juzCount;
    this.selectedStudent[0].tilawatsDone.forEach((t) => {
      this.ayatCountIndividual += t.ayatCount;
    });
    this.loadDayWiseData();
  }

  loadDayWiseData() {
    var labels = [];
    var data = [];
    var tilawats = this.selectedStudent[0].tilawatsDone;
    var tDate;
    var output = _.groupBy(tilawats, (t) => t.date);
    _.forEach(output, (value, key) => {
      var month = new Date(key.toString()).getMonth() + 1;
      tDate = new Date(key.toString()).getDate() + "/" + month;
      labels.push(tDate);
      var count = 0;
      value.forEach((t) => {
        count += t.ayatCount;
      });
      data.push(count);
    });
    this.dayWiseChartData = [{
      data: data, label: "Number of Ayats", backgroundColor:'#d6c42196', borderColor:'#a92900', 
      borderWidth:1.5,pointBackgroundColor:'black',pointBorderColor:'black', pointBorderWidth:1
    }];
    this.dayWiseChartLabels = labels;
    console.log("Output", output);

  }

  generateOverallReport() {
    var juzCounts = [];
    var studentNames = [];
    this.students.forEach((s) => {
      juzCounts.push(s.juzCount);
      studentNames.push(`${s.firstName} ${s.lastName.slice(0,1)}`);
      this.juzCountOverall += s.juzCount;
      s.tilawatsDone.forEach((t) => {
        this.ayatCountOverall += t.ayatCount;
      });
    });
    this.studentWiseJuzChartData = [{
      data: juzCounts, label: "Number of Juz",  backgroundColor:'#d6c42196', borderColor:'#a92900', 
      borderWidth:1.5, hoverBackgroundColor:"#a92900"
    }];
    this.studentWiseJuzChartLabels = studentNames;


  }

}
