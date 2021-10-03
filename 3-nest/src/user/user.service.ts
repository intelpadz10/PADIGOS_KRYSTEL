import {CRUDReturn} from './user.resource/crud_return.interface';
import {Helper} from './user.resource/helper';
import { Injectable } from '@nestjs/common';
import { User } from './user.resource/user.model';
import { debug } from 'console';

@Injectable()
export class UserService
{
    private users: Map<string, User> = new Map<string,User>();

    constructor()
    {
        this.users=Helper.populate();
    }

    logAllUser()
    {
        for(const [key,user] of this.users.entries())
        {
            console.log(key);
            user.log();
        }
    }

    getAll(): CRUDReturn
    {
        var populatedData = [];
            for(const body of this.users.values())
            {
                populatedData.push(body.toJson());
            }
            if (populatedData.length > 0){
                return{
                    success: true,
                    data: populatedData
                }
            } else
                return {
                    success: false,
                    data: "There is no information in the database."
                }
    };
    
    register(user:any): CRUDReturn
    {
        try{
            var validBodyPut: {valid: boolean; data: string} = Helper.validBodyPut(user);
            if (validBodyPut.valid)
            {
                if (!this.emailExists(user.email))
                {
                    var newUser: User = new User(
                        user.name,
                        user.age,
                        user.email,
                        user.password,
                    );
                    if (this.savetoDB(newUser))
                    {
                        if (debug) this.logAllUser();
                        return{
                            success:true,
                            data:newUser.toJson(),
                        };
                    }
                    else
                    {
                        throw new Error ('generic database error');
                    }
                }else 
                    throw new Error(`${user.email} is already in use by another user!`);
            }
            else
            {
                throw new Error(validBodyPut.data);
            }
        }
        catch (error)
        {
            console.log(error.message);
            return {success: false, data: `Error adding account, ${error.message}`};
        }
    }

    getInfo(id:string): CRUDReturn
    {
        for(const i of this.users.values())
        {
            if (i.toJson().id == id)
            {
                return{
                    success: true,
                    data: [i.toJson()]
                } 
            } 
        }
        return {
            success: false,
            data: "This ID does not exist in the database."
        }
    }

    searchUser(term: string): CRUDReturn {
        var storeData =[];
        for (const bodyTerm of this.users.values()){
            if(bodyTerm.matches(term)) {
                console.log("yawa");
                storeData.push(bodyTerm.toJson());
            }
        } 
        if(storeData.length > 0){
          return{success: true,data:storeData};
        }
        else{
            return {success: false, data: `${term} does not match any users in database!`};
        }
    }

    replaceAllPut(user:any, id:string): CRUDReturn
    {
        try
        {
            var validBodyPut: {valid: boolean; data: string} = Helper.validBodyPut(user);
                
            if (validBodyPut.valid)
            {   
                
            for(const newUser of this.users.values())
            {
                if (this.idExists(id))
                    {
                        if (!this.emailExists(user.email))
                        {
                            if(newUser.replaceValues(user))
                            {
                                return {
                                    success: true,
                                    data: newUser.toJson()
                                };
                            }
                            return {
                                success: false,
                                data:  `${user.emai} exists in current user.`
                            };
                        }
                    }else 
                        return {
                            success: false,
                            data: "Does not replace the generated ID"
                        }
                }throw new Error(`${user.email} is already in use by another user!`);    
            }throw new Error(validBodyPut.data);
        }catch (error)
        {
            return {success: false, data: `${error.message}`};
        }
    }
    
    replaceValuesPatch(user:any, id:string)
    {
        var validBody: {valid: boolean; data: string} = Helper.validBody(user);
        var count:number = this.countFunction(user,count);    
        var firstUser:User = this.users.get(id);
        var secondUser:User;
        
        try
        {
            if (validBody.valid)
            {   
            for(const newUser of this.users.values())
            {
                console.log('Success');
                if (id == newUser.toJson().id)
                {
                    if (!this.emailExists(user?.email))
                    {
                        switch(count){
                            case 1:
                                if(user.name != undefined){
                                    secondUser = new User(user.name,firstUser.toJson().age,firstUser.toJson().email,firstUser.anadertoJson().password);
                                    this.users.set(id, secondUser);
                                    this.users.get(id).newID(id);
                                    firstUser = secondUser;
                                }
                                if(user.age != undefined){
                                    secondUser = new User(firstUser.toJson().name,user.age,firstUser.toJson().email,firstUser.anadertoJson().password);
                                    this.users.set(id, secondUser);
                                    this.users.get(id).newID(id);
                                    firstUser = secondUser;
                                }
                                if(user.email != undefined){
                                    secondUser = new User(firstUser.toJson().name,firstUser.toJson().age,user.email,firstUser.anadertoJson().password);
                                    this.users.set(id, secondUser);
                                    this.users.get(id).newID(id);
                                    firstUser = secondUser;
                                }
                                if(user.password != undefined){
                                    secondUser = new User(firstUser.toJson().name,firstUser.toJson().age,user.email,user.password);
                                    this.users.set(id, secondUser);
                                    this.users.get(id).newID(id);
                                    firstUser = secondUser;
                                }
                                return {
                                    success: true, 
                                    data: firstUser.toJson()
                                }
                                break;
                            
                            case 2: 
                                if(user.name != undefined && user.age != undefined){
                                    secondUser = new User(user.name,user.age,firstUser.toJson().email,firstUser.anadertoJson().password);
                                    this.users.set(id, secondUser);
                                    this.users.get(id).newID(id);
                                    firstUser = secondUser;
                                }
                                if(user.name != undefined && user.email != undefined){
                                    secondUser = new User(firstUser.toJson().name,firstUser.toJson().age,user.email,firstUser.anadertoJson().password);
                                    this.users.set(id, secondUser);
                                    this.users.get(id).newID(id);
                                    firstUser = secondUser;
                                }
                                if(user.name != undefined && user.password != undefined){
                                    secondUser = new User(firstUser.toJson().name,firstUser.toJson().age,firstUser.toJson().email,user.password);
                                    this.users.set(id, secondUser);
                                    this.users.get(id).newID(id);
                                    firstUser = secondUser;
                                }
                                if(user.age != undefined && user.email != undefined){
                                    secondUser = new User(firstUser.toJson().name,user.age,user.email,firstUser.anadertoJson().password);
                                    this.users.set(id, secondUser);
                                    this.users.get(id).newID(id);
                                    firstUser = secondUser;
                                }
                                if(user.age != undefined && user.password != undefined){
                                    secondUser = new User(firstUser.toJson().name,user.age,firstUser.toJson().email,user.password);
                                    this.users.set(id, secondUser);
                                    this.users.get(id).newID(id);
                                    firstUser = secondUser;
                                }
                                if(user.email != undefined && user.password != undefined){
                                    secondUser = new User(firstUser.toJson().name,user.age,user.email,user.password);
                                    this.users.set(id, secondUser);
                                    this.users.get(id).newID(id);
                                    firstUser = secondUser;
                                }
                                return {
                                    success: true, 
                                    data: firstUser.toJson()
                                }
                                break;
                                
                            case 3:
                                if(user.name != undefined && user.age != undefined && user.email != undefined){
                                    secondUser = new User(user.name,user.age,user.email,firstUser.anadertoJson().password);
                                    this.users.set(id, secondUser);
                                    this.users.get(id).newID(id);
                                    firstUser = secondUser;
                                }
                                if(user.name != undefined && user.age != undefined && user.password != undefined){
                                    secondUser = new User(user.name,user.age,firstUser.toJson().email,user.password);
                                    this.users.set(id, secondUser);
                                    this.users.get(id).newID(id);
                                    firstUser = secondUser;
                                }
                                if(user.name != undefined && user.email != undefined && user.password != undefined){
                                    secondUser = new User(user.name,firstUser.toJson().age,user.email,user.password);
                                    this.users.set(id, secondUser);
                                    this.users.get(id).newID(id);
                                    firstUser = secondUser;
                                }
                                if(user.age != undefined && user.email != undefined && user.password != undefined){
                                    secondUser = new User(firstUser.toJson().name,user.age,user.email,firstUser.anadertoJson().password);
                                    this.users.set(id, secondUser);
                                    this.users.get(id).newID(id);
                                    firstUser = secondUser;
                                }
                                return {
                                    success: true, 
                                    data: firstUser.toJson()
                                }
                                break;
                            case 4:
                                if(user.name != undefined && user.age != undefined && user.email != undefined && user.password != undefined){
                                    secondUser = new User(user.name,user.age,user.email,user.password);
                                    this.users.set(id, secondUser);
                                    this.users.get(id).newID(id);
                                    firstUser = secondUser;
                                }
                                return {
                                    success: true, 
                                    data: firstUser.toJson()
                                }
                                break;
                        }
                    }else
                    throw new Error (`${user.email} exists in database that is not of the current user.`);
                  }
                }throw new Error('User not found!');
            }else{
              throw new Error(validBody.data);
          }
        }catch(error){
          return {success: false, data: `${error.message}`};
        }
    }
    
    deleteUser(id:string): CRUDReturn
    {
        if(this.users.has(id))
        {
            this.users.delete(id);
            return{
                success: true,
                data: "User data is successfully deleted."
            } 
        }
        else
        {
            return{
                success: false,
                data: "User data does not exist in database."
            } 
        }
    }

    
    loginUser(login: any):CRUDReturn {
        try{
            for (const user of this.users.values()) {
            if(user.toJson().email == login.email)
                 return user.login(login?.password);
        
            }throw new Error('Email does not match.')
        
        }
        catch (error) {
            console.log({success:false, data:error.message});
            return {success:false, data: error.message}
        
        }
    }
    

    emailExists(email:string):boolean
    {
        for(const user of this.users.values())
        {
            if(email == user.toJson().email)
            {
                return true;
            }
        }  
    }

    savetoDB(users:User): boolean
    {
        try{
            this.users.set(users.id, users);
            return this.users.has(users.id);
        }
        catch (error)
        {
            console.log(error);
            return false;
        }
    }

    idExists(id:string):boolean
    {
        for(const user of this.users.values())
        {
            if(id == user.toJson().id)
            {
                return true;
            }
        }  
    }

    countFunction(body:any, count:number){
        count=0;
        for (const key of Object.keys(body)) {
          if (key.includes(`${key}`)) {
            count++;
          }
        }
        return count;
      }
}