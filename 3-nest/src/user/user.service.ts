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
                populatedData.push(body.anaderJson());
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
                            data:newUser.anaderJson(),
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
                    data: [i.anaderJson()]
                } 
            } 
        }
        return {
            success: false,
            data: "This ID does not exist in the database."
        }
    }

    searchUser(term:string): CRUDReturn
    {
        for(const search of this.users.values())
        {
    
            if(term.toUpperCase() == search.toJson().id.toUpperCase())
            {
                return {
                    success: true,
                    data:[search.toJson()]
                }
            }
            else if(parseInt(term) == search.toJson().age)
            {
                return {
                    success: true,
                    data:[search.toJson()]
                } 
            }
            else if(term.toUpperCase() == search.toJson().name.toUpperCase())
            {
                return {
                    success: true,
                    data:[search.toJson()]
                } 
            }
            else if(term.toUpperCase() == search.toJson().email.toUpperCase())
            {
                return {
                    success: true,
                    data:[search.toJson()]
                }
            }
            else
            {
                return {
                    success: false,
                    data: `Information with '${term}' does not exist in the database.`
                }
            }
    
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
                                    data: newUser.anaderJson()
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
                                    data: newUser.anaderJson()
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

    login(info:any)
    {
        for (const i of this.users.values()) 
        {
            if(info.email,info.password)
            {
                return true;
            }else 
                false;
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
}