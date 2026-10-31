import { ApiProperty } from '@nestjs/swagger';
import { IsString, Min, Max } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  status: string;

  @IsString()
  @ApiProperty()
  description: string;

  @Min(1)
  @Max(10)
  @ApiProperty()
  priority: number;
}
