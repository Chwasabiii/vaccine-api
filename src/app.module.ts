import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { VaccinesModule } from './vaccines/vaccines.module';
import { VaccinationRecordsModule } from './vaccination-records/vaccination-records.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => ({ entities: [__dirname + '/**/*.entity{.ts,.js}'],
        type: 'mysql',
        host: c.get('DB_HOST'),
        port: +c.get('DB_PORT'),
        username: c.get('DB_USER'),
        password: c.get('DB_PASS'),
        database: c.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // dev only
      }),
    }),
    AuthModule,
    UsersModule,
    StudentsModule,
    VaccinesModule,
    VaccinationRecordsModule,
  ],
})
export class AppModule {}