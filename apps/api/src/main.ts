import './env.js';
import { NestFactory } from '@nestjs/core';
import express from 'express';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS for local frontend development
  app.enableCors({
    origin: process.env['FRONTEND_URL'] ?? 'http://localhost:3000',
    credentials: true,
  });

  // Parse JSON bodies (needed for Better Auth request proxying)
  app.use(express.json());

  const port = process.env['PORT'] ?? 4000;
  await app.listen(port);
  console.log(`🚀 Campusly API running on http://localhost:${port}`);
}
await bootstrap();
