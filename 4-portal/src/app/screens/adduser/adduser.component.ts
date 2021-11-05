import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ApiService } from 'src/app/shared/api.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})
export class AdduserComponent implements OnInit {

  constructor(private router: Router, private auth: AuthService, private api: ApiService) { }

  registerForm: FormGroup = new FormGroup({
    fcName: new FormControl('', Validators.required),
    fcAge: new FormControl(0, Validators.min(1)),
    fcEmail: new FormControl('', Validators.required),
    fcPassword: new FormControl('', Validators.required),
    fcPassword2: new FormControl('', Validators.required),
  });

  error: string = '';

  ngOnInit(): void { }

  async onSubmit() {
    if (
      this.registerForm.value['fcPassword'] !==
      this.registerForm.value['fcPassword2']
    ) {
      this.error = 'Password doesnt match!';
      console.log(this.error);
      return;
    }
    if (!this.registerForm.valid) {
      {
        this.error = 'No fields must be empty';
        console.log(this.error);
        return;
      }
    }
    if (this.registerForm.valid) {
      var payload: {
        name: string;
        email: string;
        age: number;
        password: string;
      };
      payload = {
        name: this.registerForm.value.fcName,
        age: parseInt(this.registerForm.value.fcAge),
        email: this.registerForm.value.fcEmail,
        password: this.registerForm.value.fcPassword,
      };
      this.auth.register(payload).then((data) => {
        console.log(data);
        if (this.auth.authenticated && data.success == true) {
          alert('Add user success!');
          this.nav('home');
        } else {
          this.error = data.data;
          console.log(this.error);
        }
      });
    }
  }

  nav(destination: string) {
    this.router.navigate([destination]);
  }
}
