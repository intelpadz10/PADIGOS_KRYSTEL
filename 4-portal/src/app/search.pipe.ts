import { Pipe, PipeTransform } from '@angular/core';

import { User } from './model/user.model';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(users: Array<User> = [], searchVal: string): User[] {
    if (!users || !searchVal) {
      return users;

    }
    return users.filter(user => 
      user.name.toLocaleLowerCase().includes(searchVal.toLocaleLowerCase()) ||
      user.email.toLocaleLowerCase().includes(searchVal.toLocaleLowerCase()) ||
      user.age.toString().toLocaleLowerCase().includes(searchVal.toLocaleLowerCase()));
  }
}
