import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'novo@aivacol.com' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({ example: 'Novo Nome' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 'novo' })
    @IsOptional()
    @IsString()
    nickname?: string;

    @ApiPropertyOptional({ example: 'novaSenha@123', minLength: 6 })
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
}
