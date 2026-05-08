import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) {}

  // 1. Create a car
  async create(data: { brand: string; model: string; year: number; pricePerDay: number }) {
    return this.prisma.car.create({
      data,
    });
  }

  // 2. Get all cars
  async findAll() {
    return this.prisma.car.findMany();
  }

  // 3. Get one car by ID
  async findOne(id: number) {
    return this.prisma.car.findUnique({
      where: { id },
    });
  }

  // 4. Update a car
  async update(id: number, data: { pricePerDay?: number; isAvailable?: boolean }) {
    return this.prisma.car.update({
      where: { id },
      data,
    });
  }

  // 5. Delete a car
  async remove(id: number) {
    return this.prisma.car.delete({
      where: { id },
    });
  }
}
