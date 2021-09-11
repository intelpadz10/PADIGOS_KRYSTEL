import { Injectable } from '@nestjs/common';

@Injectable()
export class Exercise3Service {
    getHello(){
        return "I love programming";
    }
    
    loopsTriangle(height: number){
        var string = '';
        
        for (var i = 0; i < height; i++) {
            for (var x = 0; x < i; x++) {
                string += '*';
            }
            string += '\n';
        }
        console.log(string);
        return string;
    }
}
