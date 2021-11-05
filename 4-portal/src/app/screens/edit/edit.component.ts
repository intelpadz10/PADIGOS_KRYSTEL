import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ApiService } from 'src/app/shared/api.service';
import { AuthService } from 'src/app/shared/auth.service';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'edit-user',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  activeindex: any;
  constructor(private router: Router,  private auth: AuthService, private api: ApiService) { }

  @Input() user: User | undefined;
  @Output() backEvent = new EventEmitter<boolean>();

  userID: string = '';

  patchForm: FormGroup = new FormGroup({
    fcName: new FormControl('', Validators.required),
    fcAge: new FormControl(0, Validators.min(1)),
    fcEmail: new FormControl('', Validators.required),
  });

  error: string = '';

  goBack() {
    this.backEvent.emit(true);
  }

  ngOnInit(): void {
    if (this.user != undefined) {
      this.userID = `${this.user.id}`;
      console.log(this.user?.id);
      this.patchForm.setValue({
        fcName: this.user.name,
        fcAge: this.user.age,
        fcEmail: this.user.email,
      });
    }
  }

  async onSubmit(newUser: string) {
    this.patchUser(newUser);
  }
  async patchUser(newUser: string){
    var decision = confirm('Are you sure you want to edit data of user ' + `${this.user?.name}` + '?');
    
    if (decision) {
      var result = await this.api.patch(`/user/${newUser}`,
        {
          name: this.patchForm.value["fcName"] || undefined,
          email: this.patchForm.value["fcEmail"] || undefined,
          age: this.patchForm.value["fcAge"] || undefined,
        });
      alert('Successfully changed!');
      
    }
    if(result.success){
      this.goBack();
    }
    else{
      alert(`Patching of user ${this.user?.name} is error`);
    }
    
  }

  nav(destination: string) {
    this.router.navigate([destination]);
  }
}
