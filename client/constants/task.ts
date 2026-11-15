export const TASK_STATUS = ['pending', 'in-progress', 'completed'] as const;
export const TASK_PRIORITY = ['low', 'medium', 'high'] as const;

export type TaskStatus = (typeof TASK_STATUS)[number];
export type TaskPriority = (typeof TASK_PRIORITY)[number];
