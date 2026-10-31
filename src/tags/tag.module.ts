import { Module } from '@nestjs/common';
import { Tags } from './entities/tags.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';

@Module({
  controllers: [TagsController],
  providers: [
    TagsService,
    {
      provide: 'TASK_REPOSITORY',
      useValue: Task,
    },
    {
      provide: 'TAG_REPOSITORY',
      useValue: Tags,
    },
  ],
  imports: [SequelizeModule.forFeature([Tags, Task])],
})
export class TagsModule {}
