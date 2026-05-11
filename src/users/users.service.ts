import {
    Injectable,
    ConflictException,
    InternalServerErrorException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    // create a user
    async create(createUserDto: CreateUserDto) {
        try {
            return await this.prisma.user.create({
                data: createUserDto,
            });
        } catch (error) {
            // P2002 is Prisma's code for "Unique constraint failed"
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
