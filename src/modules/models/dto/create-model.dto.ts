import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateModelDto {
    @ApiProperty({ example: 'uuid-da-brand' })
    @IsNotEmpty()
    @IsUUID()
    brandId: string;

    @ApiProperty({ example: 'Corolla' })
    @IsNotEmpty()
    @IsString()
    name: string;
}
