import { Exercise3Controller } from './exercise3.controller';
import { Exercise3Service } from './exercise3.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [Exercise3Controller],
  providers: [Exercise3Service]
})
export class Exercise3Module {}
