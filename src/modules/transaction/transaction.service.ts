import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}
  async create({ category, data, price, title, type }: CreateTransactionDto) {
    const createdTransaction = await this.prisma.transaction.create({
      data: {
        title,
        category,
        data,
        price,
        type,
      },
    });
    return createdTransaction;
  }

  findAll() {
    return this.prisma.transaction.findMany();
  }

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }

    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    try {
      await this.findOne(id);

      const updatedTransaction = await this.prisma.transaction.update({
        where: { id },
        data: updateTransactionDto,
      });

      return updatedTransaction;
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);

      await this.prisma.transaction.delete({
        where: { id },
      });

      return { message: 'Transaction deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
