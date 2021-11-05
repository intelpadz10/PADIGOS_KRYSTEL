import { Component, OnInit } from '@angular/core';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { ApiService } from 'src/app/shared/api.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  users: Array<User> = [];
  searchVal:any;
  
  //icons
  faTrash = faTrash;
  faEdit = faEdit;
  viewedUserIndex:number | undefined;
  Helper: any;
  
  constructor(private router: Router, private api: ApiService, private auth: AuthService) {}
  
  ngOnInit(): void {
    this.getAll();
    this.getData();
    this.resetDB();
  }
  
  
  async deleteUser(i: number) {
    var decision = confirm('Delete user ' + this.users[i].name);
    if(decision)
    {
      var result = await this.api.delete(`/user/${this.users[i].id}`);
      if(result.success){
        this.getData();
      }
    }
  }

  handleBackEvent(event:any){
    if(event  == true){
      this.viewedUserIndex = undefined;
      this.ngOnInit();
    }
  }
  
  viewUserData(i:number) {
   this.viewedUserIndex = i;
  }

  async resetDB(){
    var result = await this.api.patch('/user/reset');
    this.getData();
  }
  
  async getData(term?: string) {
    if (term == undefined || term == null || term=='') {
      this.users = await this.getAll();
    }else{
      this.users = await this.searchVal(term);
    }
    console.log(this.users);
  }
  
  async getAll(): Promise<Array<User>> {
    var result = await this.api.get('/user/all');
    var temp: Array<User> = [];
    if (result.success) {
      result.data.forEach((json: any) => {
        var tempU = User.fromJson(json.id, json);
        if (tempU != null) temp.push(tempU);
      });
    }
    return temp;
  }

  nav(destination: string) {
    this.router.navigate([destination]);
  }
}