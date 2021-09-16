import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.model';

@Injectable()
export class UserService {
    
    private users: Map<number, User> = new Map<number,User>();

    constructor(){
        this.populate();
    }
    
    getAll(){
        var populatedData = [];
        for(const user of this.users.values()){
            populatedData.push(user.toJson());
        }
        return populatedData;
    }

    populate(){
        this.users.set(1,new User(1, "Kaizer", 18, "kaizer@email.com","072009"));
        this.users.set(2,new User(2, "Kian", 18, "kian@email.com","042311"));
        this.users.set(3,new User(3, "Kirby", 18, "kirby@email.com","110414"));
        this.users.set(4,new User(4, "Kassey", 18, "kassey@email.com","053115"));
    }
}