import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { AdvancedLogger } from './shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new AdvancedLogger(),
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
