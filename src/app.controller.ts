import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // Base path is '/'
export class AppController {
    // We "Inject" the service here so we can use its logic
    constructor(private readonly appService: AppService) { }

    @Get() // Handles GET requests to 'http://localhost:3000/'
    getHello(): string {
        return this.appService.getHello();
    }

    // Add a new route for time
    @Get('time') // Handles GET requests to 'http://localhost:3000/time'
    getTime(): string {
        return this.appService.getTime();
    }
}
