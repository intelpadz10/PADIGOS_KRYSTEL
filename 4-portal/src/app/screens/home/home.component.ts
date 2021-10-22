import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  listOfUsers: any;

  constructor(private router: Router, private api: HttpClient) { }

  users: Array<any> = [];

  ngOnInit(): void {}

  requestResult = '';
  
  getAll() {
    return this.api.get(environment.API_URL + '/user/all')
    .subscribe(data => {this.listOfUsers = data});
  } 
}