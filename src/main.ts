import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // We use NestFactory to create an application instance using our Root Module
  const app = await NestFactory.create(AppModule);

  // Tell the server to listen on port 3000
  await app.listen(3000);
  console.log('Server is running on http://localhost:3000');
}

bootstrap();
