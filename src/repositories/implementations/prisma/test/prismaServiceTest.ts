import { PrismaService } from '../prisma-client.service';

// Aplicar as Migrations trocando a url do schema.prisma pelo DB de teste,
// depois voltar ao de produção
export const prismaServiceTest = new PrismaService({
    datasources: {
        db: {
            url: process.env.TEST_PRISMA_URL,
        },
    },
});
