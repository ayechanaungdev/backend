import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService) { }

    async create(createBookingDto: CreateBookingDto) {
        return this.prisma.booking.create({
            data: createBookingDto,
            // This "include" tells Prisma to return the Car and User details too!
            include: {
                car: true,
                user: true,
            },
        });
    }

    async findAll() {
        return this.prisma.booking.findMany({
            include: { car: true, user: true },
        });
    }
}
