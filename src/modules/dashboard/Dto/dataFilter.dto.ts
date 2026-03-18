import { IsEnum, IsNotEmpty } from 'class-validator';
import { TypeSearch } from 'src/common/Enum';

export class DataFilterDto {
  @IsEnum(TypeSearch)
  @IsNotEmpty()
  dataType: TypeSearch;
}
