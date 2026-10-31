import { CreatTagDto } from './create-tags.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateTagDto extends PartialType(CreatTagDto) {}
