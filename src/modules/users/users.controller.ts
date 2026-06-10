import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtPayload } from '../../shared/decorators/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'Create a new user' })
    @Post()
    create(@Body() dto: CreateUserDto, @CurrentUser() user: JwtPayload) {
        return this.usersService.create(dto, user.username);
    }

    @ApiOperation({ summary: 'List all users' })
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @ApiOperation({ summary: 'Get a user by id' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @ApiOperation({ summary: 'Update a user' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser() user: JwtPayload) {
        return this.usersService.update(id, dto, user.username);
    }

    @ApiOperation({ summary: 'Delete a user' })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
