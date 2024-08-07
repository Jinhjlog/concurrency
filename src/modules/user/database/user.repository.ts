import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PRISMA_CLIENT } from '../../../core/database/prisma.di-tokens';
import { PrismaService } from '../../../core/database/prisma.service';
import User from '../domain/user';
import { UserMapper } from '../user.mapper';

export type UserModel = Prisma.UserGetPayload<typeof validation>;

const validation = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    id: true,
    name: true,
  },
});

@Injectable()
export class UserRepository {
  constructor(
    @Inject(PRISMA_CLIENT) private readonly prismaService: PrismaService,
  ) {}

  async create(data: User): Promise<void> {
    await this.prismaService.user.create({
      data: UserMapper.toPersistence(data),
    });
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      ...validation,
      where: { id },
    });

    return user ? UserMapper.toDomain(user) : null;
  }
}
