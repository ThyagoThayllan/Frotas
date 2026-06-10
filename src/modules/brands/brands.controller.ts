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
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@ApiBearerAuth()
@ApiTags('brands')
@Controller('brands')
export class BrandsController {
    constructor(private readonly brandsService: BrandsService) {}

    @ApiOperation({ summary: 'Create a new brand' })
    @Post()
    create(@Body() dto: CreateBrandDto, @CurrentUser() user: JwtPayload) {
        return this.brandsService.create(dto, user.username);
    }

    @ApiOperation({ summary: 'List all brands' })
    @Get()
    findAll() {
        return this.brandsService.findAll();
    }

    @ApiOperation({ summary: 'Get a brand by id' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.brandsService.findOne(id);
    }

    @ApiOperation({ summary: 'Update a brand' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateBrandDto, @CurrentUser() user: JwtPayload) {
        return this.brandsService.update(id, dto, user.username);
    }

    @ApiOperation({ summary: 'Delete a brand' })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.brandsService.remove(id);
    }
}
