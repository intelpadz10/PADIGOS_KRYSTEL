import { Controller, Get } from '@nestjs/common';

import { Exercise3Service } from './exercise3.service';

@Controller('exercise3')
export class Exercise3Controller {
    constructor(private readonly exercise3: Exercise3Service){}
    
    @Get()
    getHello(): string {
      return this.exercise3.getHello();
    }
    
    @Get()
    loopsTriangle(){
        var height;
        return this.exercise3.loopsTriangle(); 
    }
}
