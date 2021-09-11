import { Injectable } from '@nestjs/common';

@Injectable()
export class Exercise3Service {
    getHello(){
        return "I love programming";
    }
    
    loopTriangle(height: number){
        var string = '';
        
        for (var i = 0; i < height; i++) {
            for (var x = 0; x < i; x++) {
                string += '*';
            }
            string += '\n';
        }
        console.log(string);
        return (string);
    }

    hello(name: string){
        return (`Hi there, ${name}!`);
    }

    primeNumber(n: number){
        
        if (n == 1 || n == 2) {
            return (`The number ${n} is a prime number`);
        } else if (n % 2 == 0) {
            return (`The number ${n} is not a prime number`);
        } else {
            return (`The number ${n} is a prime number`);
        }
    }
}
