import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsUUID, Length, Max, Min } from 'class-validator';

const CURRENT_YEAR = new Date().getFullYear();

export class CreateVehicleDto {
    @ApiProperty({ example: '9BWZZZ377VT004251' })
    @IsNotEmpty()
    @IsString()
    @Length(17, 17)
    chassis: string;

    @ApiProperty({ example: 'ABC1D23' })
    @IsNotEmpty()
    @IsString()
    licensePlate: string;

    @ApiProperty({ example: 'uuid-do-model' })
    @IsNotEmpty()
    @IsUUID()
    modelId: string;

    @ApiProperty({ example: '00123456789' })
    @IsNotEmpty()
    @IsString()
    @Length(11, 11)
    renavam: string;

    @ApiProperty({ example: 2022 })
    @IsInt()
    @Max(CURRENT_YEAR + 1)
    @Min(1900)
    year: number;
}
