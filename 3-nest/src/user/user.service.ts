import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.model';

@Injectable()
export class UserService {
    
    private users: Map<number, User> = new Map<number,User>();

    //constructor(){
    //    this.populate();
    //}
    logAllUser(){
        for(const [key,user] of this.users.entries()){
            console.log(key);
            user.log();
        }
    }
    
    populate(){
        this.users.set(1,new User(1, "Kaizer", 18, "kaizer@email.com","072009"));
        this.users.set(2,new User(2, "Kian", 18, "kian@email.com","042311"));
        this.users.set(3,new User(3, "Kirby", 18, "kirby@email.com","110414"));
        this.users.set(4,new User(4, "Kassey", 18, "kassey@email.com","053115"));
    }

    register(user:any){
        this.users.set(user.id, new User(user.id, user.name, user.age,user.email, user.password));
    }
    
    getAll(){
        var populatedData = [];
        for(const user of this.users.values()){
            populatedData.push(user.toJson());
        }
        return populatedData;
    }
    
    getInfo(id:number){
        for(const i of this.users.values()){
            if (i.toJson().id == id){
                return ["name:" + i.toJson().name, "age:" + i.toJson().age, "email:" + i.toJson().email];
            }
        }
    }

    replaceAll(user:any, id:number){
        var newUser:User;
        newUser = new User(id, user.name, user.age,user.email, user.password);
        
        for (const i of this.users.values()) {
            if (i.toJson().id == id && user.age != undefined, user.email != undefined, user.id != undefined, user.name != undefined) {
              this.users.set(id,newUser);
              console.log(newUser);
              return true;
            } 
            else {
              return "Error";
            }
          }
    }
        
    replaceValues(user:any, id:number){
        var newUser:User;
        newUser = new User(id, user.name, user.age,user.email, user.password);
        
        for (const i of this.users.values()) {
            if (i.toJson().id == id && user.age != undefined, user.email != undefined, user.id != undefined, user.name != undefined) {
              this.users.set(id,newUser);
              console.log(newUser);
              return true;
            } 
            else {
              return "Error";
            }
          }
        }

    deleteUser(id:number){
        if(this.users.has(id)){
            this.users.delete(id);
        }
        else {
            return id + " data does not exist in database.";
        }
    }

    login(info:any){
        for (const i of this.users.values()) {
            if(info.email,info.password){
                return true;
            }else 
            false;
        }
    }

      searchUser(term:string) {
        for(const search of this.users.values()){
    
            if(parseInt(term) == search.toJson().id){
                return ["name:" + search.toJson().name,"id:" + search.toJson().id,
                "email:" + search.toJson().email, "age:" + search.toJson().age];
            }
            else if(parseInt(term) == search.toJson().age){
                return ["name:" + search.toJson().name,"id:" + search.toJson().id,
                "email:" + search.toJson().email, "age:" + search.toJson().age];
            }
            else if(term == search.toJson().name){
                return ["name:" + search.toJson().name,"id:" + search.toJson().id,
                "email:" + search.toJson().email, "age:" + search.toJson().age];
            }
            else if(term.toUpperCase() == search.toJson().email.toUpperCase()){
                return ["name:" + search.toJson().name,"id:" + search.toJson().id,
                "email:" + search.toJson().email, "age:" + search.toJson().age];
            }
            else{
                return "Not found in database."
            }
    
        }
      }
}