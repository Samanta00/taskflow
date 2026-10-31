import { Inject, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
//import { Task } from './entities/task.entity';
import { Tags } from '../tags/entities/tags.entity';
import { Task } from './entities/task.entity';
import { Op } from 'sequelize';

@Injectable()
export class TasksService {
  constructor(
    @Inject('TASK_REPOSITORY')
    private readonly taskModel: typeof Task,
  ) {}

  //criando uma nova tarefa
  async createTask(createTaskDto: CreateTaskDto) {
    console.log(createTaskDto);
    const newTask = this.taskModel.create(createTaskDto as any);
    return newTask;
  }

  //encontrando todas as tarefas
  async findAll(colors?: string[]): Promise<any> {
    console.log(colors);
    return await this.taskModel.findAll({
      include: [
        {
          model: Tags,
          where: {
            cor: {
              [Op.or]: colors || [],
            },
          },
        },
      ],
      order: [['priority', 'DESC']],
    });
  }

  //encontrando uma tarefa em específico
  async findOne(id: number) {
    const task = await this.taskModel.findOne({ where: { id } });
    if (!task) throw new NotFoundException("task don't found");
    return task;
  }

  //atualizando uma tarefa em específico
  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const taskCount = await this.taskModel.count({ where: { id } });

    if (taskCount === 0) throw new NotFoundException('Task not found');

    await this.taskModel.update(updateTaskDto, { where: { id } });
    return { id, ...updateTaskDto };
  }

  //removendo uma tarefa em específico
  async removeTask(id: number) {
    const task = await this.findOne(id);
    await task.destroy();
  }
}
