import { Prisma } from '@prisma/client';
import { prisma } from './prisma';

const tenantModels = [
  'Customer',
  'Table',
  'Session',
  'MenuCategory',
  'MenuItem',
  'Order',
  'Invoice',
  'Payment',
  'RewardRule',
  'User',
  'NotificationLog',
] as const;

type TenantModel = typeof tenantModels[number];

const modelsWithDeletedAt = ['Table', 'MenuItem', 'User'] as const;

type QueryArgs = {
  where?: Record<string, any>;
  data?: Record<string, any>;
  includeDeleted?: boolean;
  [key: string]: any;
};

export function forHotel(hotelId: string) {
  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (!model || !tenantModels.includes(model as TenantModel)) {
            return query(args);
          }

          const typedArgs = (args || {}) as QueryArgs;
          typedArgs.where = typedArgs.where || {};

          // We handle findUnique and findUniqueOrThrow specifically via model-level overrides below.
          if (operation === 'findUnique' || operation === 'findUniqueOrThrow') {
            return query(args);
          }

          const readWriteOperations = [
            'findMany',
            'findFirst',
            'findFirstOrThrow',
            'count',
            'aggregate',
            'update',
            'updateMany',
            'delete',
            'deleteMany',
            'upsert',
          ];

          if (readWriteOperations.includes(operation)) {
            typedArgs.where = { ...typedArgs.where, hotelId };
          }

          const createOperations = ['create', 'createMany'];
          if (createOperations.includes(operation)) {
            if (operation === 'createMany') {
              if (Array.isArray(typedArgs.data)) {
                typedArgs.data = typedArgs.data.map(item => ({ ...item, hotelId }));
              } else if (typedArgs.data) {
                typedArgs.data = { ...typedArgs.data, hotelId };
              }
            } else if (typedArgs.data) {
              typedArgs.data = { ...typedArgs.data, hotelId };
            }
          }

          if (modelsWithDeletedAt.includes(model as any)) {
            const readOperations = [
              'findMany',
              'findFirst',
              'findFirstOrThrow',
              'count',
              'aggregate',
            ];
            
            if (readOperations.includes(operation)) {
              if (typedArgs.includeDeleted !== true) {
                typedArgs.where = { ...typedArgs.where, deletedAt: null };
              }
              delete typedArgs.includeDeleted;
            }
          }

          return query(typedArgs as any);
        },
      },
      ...Object.fromEntries(
        tenantModels.map(model => [
          model,
          {
            async findUnique({ args, query }: any) {
              const typedArgs = (args || {}) as QueryArgs;
              typedArgs.where = { ...typedArgs.where, hotelId };
              
              if (modelsWithDeletedAt.includes(model as any) && typedArgs.includeDeleted !== true) {
                typedArgs.where.deletedAt = null;
              }
              delete typedArgs.includeDeleted;
              
              const modelKey = model.charAt(0).toLowerCase() + model.slice(1) as keyof typeof prisma;
              return (prisma[modelKey] as any).findFirst(typedArgs);
            },
            async findUniqueOrThrow({ args, query }: any) {
              const typedArgs = (args || {}) as QueryArgs;
              typedArgs.where = { ...typedArgs.where, hotelId };
              
              if (modelsWithDeletedAt.includes(model as any) && typedArgs.includeDeleted !== true) {
                typedArgs.where.deletedAt = null;
              }
              delete typedArgs.includeDeleted;
              
              const modelKey = model.charAt(0).toLowerCase() + model.slice(1) as keyof typeof prisma;
              return (prisma[modelKey] as any).findFirstOrThrow(typedArgs);
            }
          }
        ])
      )
    },
  });
}
