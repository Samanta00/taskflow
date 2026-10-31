import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const SwaggerSetup = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Todo Tascom')
    .setDescription('')
    .setVersion('1.0-beta')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);
};
