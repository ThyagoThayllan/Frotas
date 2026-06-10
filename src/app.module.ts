import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { BrandsModule } from './modules/brands/brands.module';
import { DatabaseModule } from './database/database.module';
import { ModelsModule } from './modules/models/models.module';
import { UsersModule } from './modules/users/users.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { AppCacheModule } from './shared/cache/cache.module';
import { validationSchema } from './config/validation.schema';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validationSchema,
        }),
        AppCacheModule,
        AuthModule,
        BrandsModule,
        DatabaseModule,
        ModelsModule,
        UsersModule,
        VehiclesModule,
    ],
})
export class AppModule {}
