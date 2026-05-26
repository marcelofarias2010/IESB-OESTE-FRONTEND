import prismaPackage from '@prisma/client';

const { PrismaClient } = prismaPackage;

export const prisma = new PrismaClient();
