import { Component, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private api: HttpClient) {}

  ngOnInit(): void {}

  fCEmail = new FormControl();
  fCPassword = new FormControl();
  requestResult = '';
  
  async login() {
    var result: any = await this.api
      .post(environment.API_URL + '/user/login', {
        email: this.fCEmail.value,
        password: this.fCPassword.value,
      })
      .toPromise();
    if (result.success) {
      this.nav('home');
    } else {
      alert('Incorrect Details');
      console.log('Sayop ka bai');
    }
  }
  nav(destination: string) {
    this.router.navigate([destination]);
  }
}
