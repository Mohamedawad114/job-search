import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { TypeSearch } from 'src/common';

export class DataFilterDto {
  @IsEnum(TypeSearch)
  @IsNotEmpty()
  dataType: TypeSearch;
}
