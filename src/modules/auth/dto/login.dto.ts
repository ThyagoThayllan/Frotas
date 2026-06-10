import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'aivacol' })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ example: 'aivacol@2024' })
    @IsNotEmpty()
    @IsString()
    password: string;
}
