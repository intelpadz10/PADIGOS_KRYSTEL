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

    hello(name: string){
        return (`Hi there!, + ${name}`);
    }

    primeNumber(n: number){
        var a = 5;
        var b = 6;
        
        if (a == 1 || a == 2) {
            console.log(`${a} is a prime number? True`);
        } else if (a % 2 == 0) {
            console.log(`${a} is a prime number? False`);
        } else {
            console.log(`${a} is a prime number? True`);
        }
        
        if (b == 1 || b == 2) {
            console.log(`${b} is a prime number? True`);
        } else if (b % 2 == 0) {
            console.log(`${b} is a prime number? False`);
        } else {
            console.log(`${b} is a prime number? True`);
        }
    }
}
