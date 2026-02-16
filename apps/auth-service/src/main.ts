import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite Dev Server
      'http://localhost',      // Dockerized Frontend (Port 80)
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
