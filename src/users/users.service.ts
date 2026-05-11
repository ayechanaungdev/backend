import {
    Injectable,
    ConflictException,
    InternalServerErrorException
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

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
}
