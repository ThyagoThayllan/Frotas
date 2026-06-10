import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'admin@aivacol.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Admin Aivacol' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'admin' })
    @IsNotEmpty()
    @IsString()
    nickname: string;

    @ApiProperty({ example: 'senha@123', minLength: 6 })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'admin' })
    @IsNotEmpty()
    @IsString()
    username: string;
}
