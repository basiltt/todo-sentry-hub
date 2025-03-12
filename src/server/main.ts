
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Allow CORS for frontend communication
  app.useGlobalPipes(new ValidationPipe()); // Enable validation
  await app.listen(3001); // Run on port 3001
}
bootstrap();
