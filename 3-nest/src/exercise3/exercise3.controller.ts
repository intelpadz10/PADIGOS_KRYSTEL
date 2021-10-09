import { Controller, Get, Param } from '@nestjs/common';
import { Exercise3Service } from './exercise3.service';

@Controller('exercise3')
export class Exercise3Controller {
  constructor(private readonly exercise3: Exercise3Service) { }

  @Get()
  getHello(): string {
    return this.exercise3.getHello();
  }

  @Get("/looptriangle/:height")
  loopsTriangle(@Param('height') height: number) {
    return this.exercise3.loopTriangle(height);
  }

  @Get("/hello/:name")
  hello(@Param('name') name: string) {
    return this.exercise3.hello(name);
  }

  @Get("/primeNumber/:n")
  primeNumber(@Param('n') n: number) {
    return this.exercise3.primeNumber(n);
  }

  @Get('/addJoshCar')
  test() {
    return this.exercise3.addJoshCar();
  }
}

