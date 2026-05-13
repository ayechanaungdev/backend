import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [UsersModule,
    JwtModule.register({
      global: true, // 👈 Makes the token generator available everywhere
      secret: 'MY_SUPER_SECRET_KEY_123', // ⚠️ In production, this goes in a .env file!
      signOptions: { expiresIn: '1d' }, // 👈 Token expires in 1 day
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule { }
