import { Component, OnInit } from '@angular/core';
import { studentRoutes } from 'src/app/shared/appConfig';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  dashboard = "";
  listStudents = `/${studentRoutes.Base}/${studentRoutes.List}`;
  addTilawat = `/${studentRoutes.Base}/${studentRoutes.Add}`;

}
