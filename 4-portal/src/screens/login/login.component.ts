import { Component, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  
  fCEmail = new FormControl();
  fCPassword = new FormControl();
  
  login(){
    // if(email == "padigos1000@gmail.com" && password == "secret"){
    //   this.router.navigate(["home"]);
    // }
    // else{
    //   alert ("Incorrect Details");
    //   console.log("Sayop ka bai");
    // }
  }
}
