import { Prisma } from "@prisma/client";
import { PrismaService } from "src/core/database/prisma.service";

export abstract class BaseRepository {
    constructor(protected readonly prismaService: PrismaService) {}

    async transactionWithSerializable<T>(
        fn: (tx: Prisma.TransactionClient) => Promise<T> 
    ): Promise<T> {
        return this.prismaService.$transaction(fn, {
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable
        });
    }
}