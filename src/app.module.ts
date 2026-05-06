import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [], // We will add other modules here later
    controllers: [AppController], // Routes go here
    providers: [AppService], // Business logic goes here
})
export class AppModule { }
