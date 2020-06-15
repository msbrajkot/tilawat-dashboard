import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiBaseUrl } from '../appConfig';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from "rxjs/operators";
import { Student } from '../models/Student';
import { Tilawat } from '../models/Tilawat';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(
    private http: HttpClient,
  ) { }

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }
  private baseUrl = apiBaseUrl;

  private log(message: string) {
    console.log(message);
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      
      this.log(`${operation} failed: ${error.message}`);
      
      return of(result as T);
    };
  }

  getStudents(): Observable<any> {
    const url = this.baseUrl + "/student";
    return this.http
    .get<any>(url)
    .pipe(
      tap(_ => this.log(`${JSON.stringify(_)}`)),
      catchError(this.handleError<any>("getStudents"))
    );
  }

  getStudentById(studentId:string):Observable<any> {
    const url = `${this.baseUrl}/student/${studentId}`;
    console.log("URL",url);
    
    return this.http
    .get<any>(url)
    .pipe(
      tap(_ => this.log(`Fetched Student with studentId = ${studentId}`)),
      catchError(this.handleError<any>(`getStudent id= ${studentId}`))
    );

  }

  addTilawat(studentId:string,tilawat: Tilawat): Observable<any>{
    const url = `${this.baseUrl}/student/addTilawat/${studentId}`;
    return this.http
    .post<any>(url,tilawat,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Added Tilawat for student ${_._id} ${_.firstName}.`)),
      catchError(this.handleError<any>('addTilawat'))
    );
  }

  deleteTilawat(studentId:string,tilawatId:string): Observable<any> {
    const url = `${this.baseUrl}/student/deleteTilawat/${studentId}`;
    return this.http
    .put<any>(url,tilawatId,this.httpOptions)
    .pipe(
      tap(_ => this.log(`Removed tilawat for studentId ${studentId}`)),
      catchError(this.handleError<any>('deleteTilawat'))
    );
  }

  

  // deleteStudent(studentId:string):Observable<any> {
  //   const url = `${this.baseUrl}/student/${studentId}`;
  //   return this.http
  //   .delete<any>(url)
  //   .pipe(
  //     tap(_ => this.log(`Deleted student with studentId = ${studentId}`)),
  //     catchError(this.handleError<any>(`deleteStudent id= ${studentId}`))
  //   );

  // }

}
