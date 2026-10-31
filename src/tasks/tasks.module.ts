import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [TasksController],
  providers: [
    TasksService,
    {
      provide: 'TASK_REPOSITORY',
      useValue: Task,
    },
  ],
  imports: [SequelizeModule.forFeature([Task])],
})
export class TasksModule {}
