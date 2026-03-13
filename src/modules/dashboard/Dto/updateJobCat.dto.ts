import { PartialType } from "@nestjs/mapped-types";
import { CreateJobCatDto } from "./createJobCat.dto";

export class UpdateJobCat extends PartialType(CreateJobCatDto){}