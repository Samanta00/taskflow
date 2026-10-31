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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TagsService } from './tags.service';
import { CreatTagDto } from './dto/create-tags.dto';
import { UpdateTagDto } from './dto/update-tags.dto';
import { JWT_GUARD } from 'src/auth/jwt.strategy';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller(':taskId/tags')
@ApiTags('Tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @UseGuards(AuthGuard(JWT_GUARD))
  @UseGuards(AuthGuard(JWT_GUARD))
  @Post()
  @ApiOperation({ summary: 'create a tag assigned to a task' })
  @ApiResponse({
    status: 201,
    description: 'The new tag has been successfully added',
  })
  @ApiResponse({ status: 404, description: "tag don't created" })
  createTag(
    @Body() createTagDto: CreatTagDto,
    @Param('taskId', new ParseIntPipe()) taskId: number,
  ) {
    createTagDto.taskId = taskId;
    return this.tagService.create(createTagDto);
  }

  @Get()
  @ApiOperation({ summary: 'View all tags' })
  @ApiResponse({
    status: 200,
    description: 'tags returned from a successful task',
    isArray: true,
  })
  @ApiResponse({ status: 404, description: 'tags not found' })
  @HttpCode(HttpStatus.OK)
  async findAlltag(@Param('taskId', new ParseIntPipe()) taskId: number) {
    return this.tagService.findAlltag(taskId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'View tag by id' })
  @ApiResponse({
    status: 200,
    description: 'specific tag returned from a successful task',
  })
  @ApiResponse({ status: 404, description: 'tag not found' })
  @HttpCode(HttpStatus.OK)
  findOneTag(@Param('id', new ParseIntPipe()) id: number) {
    return this.tagService.findOneTag(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Edit tag by id' })
  @ApiResponse({ status: 200, description: 'specific tag was update' })
  @ApiResponse({ status: 404, description: "tag don't updated" })
  updateTag(
    @Body() updateTagDto: UpdateTagDto,
    @Param('taskId', new ParseIntPipe()) taskId: number,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    updateTagDto.taskId = taskId;
    return this.tagService.updateTag(id, updateTagDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove tag by id' })
  @ApiResponse({ status: 200, description: 'specific tag was deleted' })
  @ApiResponse({ status: 404, description: "tag don't deleted" })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.tagService.remove(id);
  }
}
