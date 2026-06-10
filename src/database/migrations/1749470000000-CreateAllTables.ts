import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateAllTables1749470000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                columns: [
                    { default: 'NEWID()', isPrimary: true, name: 'id', type: 'uniqueidentifier' },
                    { isNullable: false, length: '100', name: 'username', type: 'nvarchar' },
                    { isNullable: false, name: 'password_hash', type: 'nvarchar' },
                    { isNullable: false, length: '100', name: 'nickname', type: 'nvarchar' },
                    { isNullable: false, length: '150', name: 'name', type: 'nvarchar' },
                    { isNullable: false, length: '150', name: 'email', type: 'nvarchar' },
                    { isNullable: false, length: '100', name: 'created_by', type: 'nvarchar' },
                    { default: 'GETDATE()', isNullable: false, name: 'created_at', type: 'datetime2' },
                    { default: 'GETDATE()', isNullable: false, name: 'updated_at', type: 'datetime2' },
                ],
                name: 'users',
            }),
            true,
        );

        await queryRunner.createIndex(
            'users',
            new TableIndex({ columnNames: ['username'], isUnique: true, name: 'UQ_users_username' }),
        );

        await queryRunner.createIndex(
            'users',
            new TableIndex({ columnNames: ['email'], isUnique: true, name: 'UQ_users_email' }),
        );

        await queryRunner.createTable(
            new Table({
                columns: [
                    { default: 'NEWID()', isPrimary: true, name: 'id', type: 'uniqueidentifier' },
                    { isNullable: false, length: '100', name: 'name', type: 'nvarchar' },
                    { isNullable: false, length: '100', name: 'created_by', type: 'nvarchar' },
                    { default: 'GETDATE()', isNullable: false, name: 'created_at', type: 'datetime2' },
                    { default: 'GETDATE()', isNullable: false, name: 'updated_at', type: 'datetime2' },
                ],
                name: 'brands',
            }),
            true,
        );

        await queryRunner.createIndex(
            'brands',
            new TableIndex({ columnNames: ['name'], isUnique: true, name: 'UQ_brands_name' }),
        );

        await queryRunner.createTable(
            new Table({
                columns: [
                    { default: 'NEWID()', isPrimary: true, name: 'id', type: 'uniqueidentifier' },
                    { isNullable: false, length: '100', name: 'name', type: 'nvarchar' },
                    { isNullable: false, name: 'brand_id', type: 'uniqueidentifier' },
                    { isNullable: false, length: '100', name: 'created_by', type: 'nvarchar' },
                    { default: 'GETDATE()', isNullable: false, name: 'created_at', type: 'datetime2' },
                    { default: 'GETDATE()', isNullable: false, name: 'updated_at', type: 'datetime2' },
                ],
                name: 'models',
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'models',
            new TableForeignKey({
                columnNames: ['brand_id'],
                name: 'FK_models_brand_id',
                onDelete: 'NO ACTION',
                onUpdate: 'NO ACTION',
                referencedColumnNames: ['id'],
                referencedTableName: 'brands',
            }),
        );

        await queryRunner.createTable(
            new Table({
                columns: [
                    { default: 'NEWID()', isPrimary: true, name: 'id', type: 'uniqueidentifier' },
                    { isNullable: false, length: '10', name: 'license_plate', type: 'nvarchar' },
                    { isNullable: false, length: '17', name: 'chassis', type: 'nvarchar' },
                    { isNullable: false, length: '11', name: 'renavam', type: 'nvarchar' },
                    { isNullable: false, name: 'year', type: 'int' },
                    { isNullable: false, name: 'model_id', type: 'uniqueidentifier' },
                    { isNullable: false, length: '100', name: 'created_by', type: 'nvarchar' },
                    { default: 'GETDATE()', isNullable: false, name: 'created_at', type: 'datetime2' },
                    { default: 'GETDATE()', isNullable: false, name: 'updated_at', type: 'datetime2' },
                ],
                name: 'vehicles',
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'vehicles',
            new TableForeignKey({
                columnNames: ['model_id'],
                name: 'FK_vehicles_model_id',
                onDelete: 'NO ACTION',
                onUpdate: 'NO ACTION',
                referencedColumnNames: ['id'],
                referencedTableName: 'models',
            }),
        );

        await queryRunner.createIndex(
            'vehicles',
            new TableIndex({ columnNames: ['license_plate'], isUnique: true, name: 'UQ_vehicles_license_plate' }),
        );

        await queryRunner.createIndex(
            'vehicles',
            new TableIndex({ columnNames: ['chassis'], isUnique: true, name: 'UQ_vehicles_chassis' }),
        );

        await queryRunner.createIndex(
            'vehicles',
            new TableIndex({ columnNames: ['renavam'], isUnique: true, name: 'UQ_vehicles_renavam' }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('vehicles', true);
        await queryRunner.dropTable('models', true);
        await queryRunner.dropTable('brands', true);
        await queryRunner.dropTable('users', true);
    }
}
