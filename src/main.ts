import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as jwt from 'jsonwebtoken';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('user-management')
  console.log(getToken("668558aaff27e0a95d259608"));
  await app.listen(3000);
}
bootstrap();
function getToken(userId: any) {
 return jwt.sign({userId},'secret');
}

