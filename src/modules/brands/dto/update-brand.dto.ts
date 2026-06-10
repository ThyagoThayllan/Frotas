import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBrandDto {
    @ApiPropertyOptional({ example: 'Honda' })
    @IsOptional()
    @IsString()
    name?: string;
}
