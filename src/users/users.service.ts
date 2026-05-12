import {
    Injectable,
    ConflictException,
    InternalServerErrorException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    // create a user
    async create(createUserDto: CreateUserDto) {
        try {
            // 1. Hash the password before saving! (10 is the "salt rounds" - security level)
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            // 2. Save the user with the hashed password instead of the real one
            const newUser = await this.prisma.user.create({
                data: {
                    ...createUserDto,
                    password: hashedPassword, // 👈 Override the plain text password
                },
            });
            // 3. Security: Separate the password from the rest of the user data for security reasons
            const { password, ...userWithoutPassword } = newUser;

            // 4. Return the user data without the password (clean object)
            return userWithoutPassword;

        } catch (error) {
            // ... (Keep your existing P2002 error handling here) ...
            if (error.code === 'P2002') {
                const target = error.meta?.target as string[];
                const fieldName = target ? target.join(', ') : 'field';
                throw new ConflictException(`The ${fieldName} is already taken! Please use another one.`);
            }
            console.error('Database Error:', error);
            throw new InternalServerErrorException('Something went wrong on our side.');
        }
    }

    // find all users
    async findAll() {
        return this.prisma.user.findMany();
    }

    // find one user by id
    async findOne(id: number) {
        return this.prisma.user.findUnique({ where: { id } });
    }

    // update a user by id
    async update(id: number, updateUserDto: UpdateUserDto) {
        // We wrap this in try-catch too, in case they try to update to an existing email!
        try {
            return await this.prisma.user.update({
                where: { id },
                data: updateUserDto,
            });
        } catch (error) {
            if (error.code === 'P2002') {
                // We extract the field name from the Prisma error metadata
                // Example: error.meta.target might be ['email']
                const target = error.meta?.target as string[];
                const fieldName = target ? target.join(', ') : 'field';

                throw new ConflictException(`The ${fieldName} is already taken! Please use another one.`);
            }
            console.error('Database Error:', error);
            throw new InternalServerErrorException('Something went wrong on our side.');
        }
    }

    // remove a user by id
    async remove(id: number) {
        return this.prisma.user.delete({ where: { id } });
    }
}
