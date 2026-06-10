import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../shared/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ summary: 'Authenticate and receive a JWT token' })
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @Public()
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
}
