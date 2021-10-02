import { Controller, Get, Post, Body, Param, Put, Patch, Delete} from '@nestjs/common';
import { info } from 'console';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
    
    constructor(private readonly userService:UserService){}

    @Post("/register")
    register(@Body()body:any){
        return this.userService.register(body);
    }

    @Get("/all/")
    getAll(){
       return this.userService.getAll(); 
    }

    @Get("/:id")
    getInfo(@Param('id')id:string){
        return this.userService.getInfo(id);
    }

    @Put("/:id")
    replaceAllPut(@Body()body:any, @Param('id')id:string){
        return this.userService.replaceAllPut(body,id);
    }

    @Patch("/:id")
    replaceValuesPatch(@Body()body:any, @Param('id')id:string){
        return this.userService.replaceValuesPatch(body,id);
    }

    @Delete("/:id")
    deleteUser(@Param('id')id:string){
        const Parse = parseInt (id);
        return this.userService.deleteUser(id);
    }

    @Post("/login")
    login(@Body()body:string){
        return this.userService.login(body);
    }

    @Get("search/:term")
    searchUser(@Param('term')term:string){
        return this.userService.searchUser(term);
    }
}
