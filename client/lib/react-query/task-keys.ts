export const taskKeys = {
  all: ['tasks'] as const,

  lists: () => [...taskKeys.all, 'list'] as const,

  list: (params: Record<string, unknown>) => [...taskKeys.lists(), params] as const,

  details: () => [...taskKeys.all, 'detail'] as const,

  detail: (id: string) => [...taskKeys.details(), id] as const,
};
