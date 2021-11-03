import { Component, OnInit } from '@angular/core';

import { ApiService } from 'src/app/shared/api.service';
import { AuthService } from 'src/app/shared/auth.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {}

  fCEmail = new FormControl();
  fCPassword = new FormControl();
  requestResult = '';
  error = '';
  
  async login() {
    this.error = '';
    var result: any = await this.auth.login(
        this.fCEmail.value,
        this.fCPassword.value,
    );
    console.log(result);
    if (this.auth.authenticated) {
      this.nav('home');
    } else {
      this.error = result.data;
    }
  }
  nav(destination: string) {
    this.router.navigate([destination]);
  }
}
