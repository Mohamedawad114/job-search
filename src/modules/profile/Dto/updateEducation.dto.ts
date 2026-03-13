import { PartialType } from '@nestjs/mapped-types';
import { AddEducationDto } from './addEducation.dto';

export class updateEducationDto extends PartialType(AddEducationDto) {}
