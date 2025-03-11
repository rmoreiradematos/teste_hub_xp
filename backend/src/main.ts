import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './commom/pipes/custom-validation.pipe';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new CustomValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
