import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class ChangeAdminCompany{
    @IsNumber()
    @IsPositive()
        @IsNotEmpty()
    userId:number
}