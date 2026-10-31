import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '@nestjs/passport';
import { JWT_GUARD } from 'src/auth/jwt.strategy';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('tasks')
@ApiTags('todos')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(AuthGuard(JWT_GUARD))
  @Post()
  @ApiOperation({ summary: 'Create a new Task' })
  @ApiResponse({
    status: 201,
    description: 'The new task has been successfully added',
  })
  @ApiResponse({ status: 404, description: "task don't created" })
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'View All Tasks' })
  @ApiResponse({
    status: 200,
    description: 'tasks returned from a successful task',
    isArray: true,
  })
  @ApiResponse({ status: 404, description: 'tasks not found' })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('colors') colors?: string) {
    return this.tasksService.findAll(colors?.split(','));
  }

  @Get(':id')
  @ApiOperation({ summary: 'View a specific Tasks by id' })
  @ApiResponse({
    status: 200,
    description: 'specific task returned from a successful task',
  })
  @ApiResponse({ status: 404, description: 'task not found' })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific Tasks by id' })
  @ApiResponse({ status: 200, description: 'specific task was update' })
  @ApiResponse({ status: 404, description: "task don't updated" })
  @HttpCode(HttpStatus.OK)
  updateTask(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific Tasks by id' })
  @ApiResponse({ status: 200, description: 'specific task was deleted' })
  @ApiResponse({ status: 404, description: "task don't deleted" })
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTask(@Param('id', new ParseIntPipe()) id: number) {
    return this.tasksService.removeTask(id);
  }
}
