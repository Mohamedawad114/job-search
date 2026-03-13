import { IsEnum, IsNotEmpty } from "class-validator";
import { Sys_Role } from "src/common";

export class changeRoleDto{
    @IsEnum(Sys_Role)
        @IsNotEmpty()
    role:Sys_Role
} 