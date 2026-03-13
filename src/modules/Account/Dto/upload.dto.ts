import { IsEnum } from "class-validator";
import { File } from "src/common";

export class uploadDto{
    @IsEnum(File)
    file:string
}