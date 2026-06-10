import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Length, Max, Min } from 'class-validator';

const CURRENT_YEAR = new Date().getFullYear();

export class UpdateVehicleDto {
    @ApiPropertyOptional({ example: '9BWZZZ377VT004251' })
    @IsOptional()
    @IsString()
    @Length(17, 17)
    chassis?: string;

    @ApiPropertyOptional({ example: 'ABC1D23' })
    @IsOptional()
    @IsString()
    licensePlate?: string;

    @ApiPropertyOptional({ example: 'uuid-do-model' })
    @IsOptional()
    @IsUUID()
    modelId?: string;

    @ApiPropertyOptional({ example: '00123456789' })
    @IsOptional()
    @IsString()
    @Length(11, 11)
    renavam?: string;

    @ApiPropertyOptional({ example: 2023 })
    @IsInt()
    @IsOptional()
    @Max(CURRENT_YEAR + 1)
    @Min(1900)
    year?: number;
}
