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
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { ModelsService } from './models.service';

@ApiBearerAuth()
@ApiTags('models')
@Controller('models')
export class ModelsController {
    constructor(private readonly modelsService: ModelsService) {}

    @ApiOperation({ summary: 'Create a new model' })
    @Post()
    create(@Body() dto: CreateModelDto, @CurrentUser() user: JwtPayload) {
        return this.modelsService.create(dto, user.username);
    }

    @ApiOperation({ summary: 'List all models' })
    @Get()
    findAll() {
        return this.modelsService.findAll();
    }

    @ApiOperation({ summary: 'Get a model by id' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.modelsService.findOne(id);
    }

    @ApiOperation({ summary: 'Update a model' })
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateModelDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.modelsService.update(id, dto, user.username);
    }

    @ApiOperation({ summary: 'Delete a model' })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.modelsService.remove(id);
    }
}
