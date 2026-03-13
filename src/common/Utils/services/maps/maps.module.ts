import { HttpModule, HttpService } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { MapService } from "./maps.service";

@Module({
    imports:[HttpModule],
    providers: [ MapService],
    exports:[MapService]
}

)
export class MapsModule{}