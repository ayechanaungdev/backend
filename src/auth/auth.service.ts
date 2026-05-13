import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        // 1. Find the user by email
        const user = await this.usersService.findByEmailForAuth(loginDto.email);

        // 2. If user doesn't exist, kick them out
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // 3. Compare the typed password with the scrambled hash in the DB
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        // 4. If wrong password, kick them out
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // 5. Generate the VIP Pass (JWT)
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = await this.jwtService.signAsync(payload);

        // 6. Return the token and the user info (but without the password!)
        const { password, ...userWithoutPassword } = user;

        return {
            access_token: token,
            user: userWithoutPassword
        };
    }
}
