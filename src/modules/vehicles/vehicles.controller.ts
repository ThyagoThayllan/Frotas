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
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesService } from './vehicles.service';

@ApiBearerAuth()
@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
    constructor(private readonly vehiclesService: VehiclesService) {}

    @ApiOperation({ summary: 'Register a new vehicle' })
    @Post()
    create(@Body() dto: CreateVehicleDto, @CurrentUser() user: JwtPayload) {
        return this.vehiclesService.create(dto, user.username);
    }

    @ApiOperation({ summary: 'List all vehicles (cached)' })
    @Get()
    findAll() {
        return this.vehiclesService.findAll();
    }

    @ApiOperation({ summary: 'Get a vehicle by id (cached)' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.vehiclesService.findOne(id);
    }

    @ApiOperation({ summary: 'Update a vehicle' })
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() dto: UpdateVehicleDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.vehiclesService.update(id, dto, user.username);
    }

    @ApiOperation({ summary: 'Delete a vehicle' })
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id') id: string) {
        return this.vehiclesService.remove(id);
    }
}
