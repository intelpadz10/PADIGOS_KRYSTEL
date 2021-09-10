import { Injectable } from '@nestjs/common';

@Injectable()
export class Exercise3Service {
    getHello(){
        return "I love programming";
    }
    
    loopsTriangle(){
        var height = 10;
        var string = '';
        for (var i = '*'; i.length <= height; i = i + '*') {
            console.log(i);
}
    }
}
