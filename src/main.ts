import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Use NestExpressApplication for static assets
  const app = await NestFactory.create<NestExpressApplication>(AppModule,{bufferLogs: true});
  // Serve static files from 'uploads' folder at '/uploads' path
  app.useStaticAssets(join(__dirname, '..', 'uploads'),{
    prefix: '/uploads/',
  })

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  const config = new DocumentBuilder()
  .setTitle('Real Estate API')
  .setDescription('Real Estate Property Management API')
  .setVersion('1.0')
  .addBearerAuth()  // JWT Auth in Swagger
  .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api-docs', app, document)


  await app.listen(process.env.PORT || 3000);
  console.log(`Server running on port ${process.env.PORT || 3000}.`)
  console.log(`Swagger Docs: http:localhost:${process.env.PORT || 3000}/api-docs`)
}
bootstrap();
