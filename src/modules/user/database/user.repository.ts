import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import User from '../domain/user';
import { UserMapper } from '../user.mapper';
import { PRISMA_CLIENT } from '@core/database/prisma.di-tokens';
import { PrismaService } from '@core/database/prisma.service';

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

  async findById(id: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      ...validation,
      where: { id },
    });

    return user ? UserMapper.toDomain(user) : null;
  }

  async findByIdWithPessimisticLock(
    id: string,
    tx: Prisma.TransactionClient,
  ): Promise<User | null> {
    const user = await tx.$queryRaw<UserModel[]>`
      SELECT u.user_id as id, u.name FROM users u WHERE user_id = ${id} FOR UPDATE`;

    return user.length ? UserMapper.toDomain(user[0]) : null;
  }
}
