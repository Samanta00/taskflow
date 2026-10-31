import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerSetup } from './swagger/swaggerSetup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  SwaggerSetup(app);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
