import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatTagDto {
  @ApiProperty()
  taskId?: number;

  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  cor: string;
}
