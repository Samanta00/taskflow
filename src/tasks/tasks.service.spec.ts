import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let taskService: TasksService;
  let taskModelMock = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: 'TASK_REPOSITORY',
          useValue: taskModelMock,
        },
      ],
    }).compile();

    taskService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a todo list entity successfully', async () => {
      const taskMock = [
        {
          id: 1,
          title: 'ir para o mercado',
          status: 'feito',
          description: 'comprar uma bolsa',
          priority: 10,
        },
      ];
      const expectedTask = [
        {
          id: 1,
          title: 'ir para o mercado',
          status: 'feito',
          description: 'comprar uma bolsa',
          priority: 10,
        },
      ];
      jest.spyOn(taskModelMock, 'findAll').mockResolvedValueOnce(taskMock);

      const result = await taskService.findAll();

      expect(result).toEqual(expectedTask);
    });
  });

  describe('findOne', () => {
    it('should return a task when found', async () => {
      const taskId = 1;
      const taskMock = {
        id: taskId,
        title: 'ir para o mercado',
        status: 'feito',
        description: 'comprar uma bolsa',
        priority: 10,
      };

      taskModelMock.findOne.mockResolvedValueOnce(taskMock);

      const result = await taskService.findOne(taskId);

      expect(result).toEqual(taskMock);
      expect(taskModelMock.findOne).toHaveBeenCalledTimes(1);
      expect(taskModelMock.findOne).toHaveBeenCalledWith({
        where: { id: taskId },
      });
    });
  });

  describe('createTasks', () => {
    it('Should task created successfully', async () => {
      const createTaskDto = {
        title: 'ir para o mercado',
        status: 'feito',
        description: 'comprar uma bolsa',
        priority: 10,
      };
      const createTaskMock = {
        id: 1,
        title: 'ir para o mercado',
        status: 'feito',
        description: 'comprar uma bolsa',
        priority: 10,
      };
      const expectedTask = {
        id: 1,
        title: 'ir para o mercado',
        status: 'feito',
        description: 'comprar uma bolsa',
        priority: 10,
      };
      jest.spyOn(taskModelMock, 'create').mockResolvedValueOnce(createTaskMock);

      const result = await taskService.createTask(createTaskDto);

      expect(result).toEqual(expectedTask);
    });
  });

  describe('update', () => {
    it('should task update successfully', async () => {
      const updateTaskDto = {
        id: 1,
        title: 'ir para o mercado',
        status: 'feito',
        description: 'comprar uma bolsa',
        priority: 10,
      };
      const updateTaskMock = {
        id: 1,
        title: 'ir para o mercado',
        status: 'feito',
        description: 'comprar uma bolsa',
        priority: 10,
      };
      const expectedTask = {
        id: 1,
        title: 'ir para o mercado',
        status: 'feito',
        description: 'comprar uma bolsa',
        priority: 10,
      };
      jest.spyOn(taskModelMock, 'count').mockResolvedValueOnce(1);
      jest.spyOn(taskModelMock, 'update').mockResolvedValueOnce([]);

      const result = await taskService.update(updateTaskDto.id, updateTaskDto);

      expect(result).toEqual(expectedTask);
    });
  });

  describe('removeTask', () => {
    it('should remove a task successfully', async () => {
      const taskId = 1;
      const taskMock = {
        id: taskId,
        title: 'ir para o mercado',
        status: 'feito',
        description: 'comprar uma bolsa',
        priority: 10,
        destroy: jest.fn(), // Adiciona a função destroy vazia
      };

      taskModelMock.findOne.mockResolvedValueOnce(taskMock);

      await expect(taskService.removeTask(taskId)).resolves.not.toThrow();

      expect(taskModelMock.findOne).toHaveBeenCalledWith({
        where: { id: taskId },
      });

      expect(taskMock.destroy).toHaveBeenCalledTimes(1); // Verifica se destroy foi chamado corretamente
    });
  });
});
