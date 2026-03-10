import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator"
import { PropertyStatus, PropertyType } from "../property.entity";
import { Type } from "class-transformer";

export class CreatePropertyDto{
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;
    
    @Type( () => Number)
    @IsNumber()
    @Min(0)
    price!: number;

    @IsEnum(PropertyStatus)
    status!: PropertyStatus;

    @IsEnum(PropertyType)
     type!: PropertyType;

    @IsString()
    @IsNotEmpty()
    location!: string;

    @IsString()
    @IsNotEmpty()
    area!: string;
    

    @IsOptional()
    @IsArray()
    @IsString({ each: true})
    images? : string[];
}