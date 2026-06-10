import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateModelDto {
    @ApiPropertyOptional({ example: 'uuid-da-brand' })
    @IsOptional()
    @IsUUID()
    brandId?: string;

    @ApiPropertyOptional({ example: 'Civic' })
    @IsOptional()
    @IsString()
    name?: string;
}
