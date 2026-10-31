import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Tags } from './tags/entities/tags.entity';
import { Task } from './tasks/entities/task.entity';
import { TagsModule } from './tags/tag.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    TasksModule,
    TagsModule,
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        entities: [__dirname + '/../**/*.entity.{ts|js}'],
        autoLoadEntities: true,
        logger: 'debug',
        models: [Tags, Task],
      }),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: JwtStrategy,
      useFactory: (configService: ConfigService) => {
        return new JwtStrategy(configService);
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
