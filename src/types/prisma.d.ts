// Modern type declarations file for Prisma
// This ensures TypeScript properly resolves Prisma Client types across the workspace

import type { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export {};
