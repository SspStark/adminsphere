'use client';

import { useTask, useCreateComment } from '@/hooks/use-tasks';
import CommentForm from './comments/comment-form';
import CommentItem from './comments/comment-item';
import { CreateCommentSchema } from '@/schemas/comment.schema';
import { toast } from 'sonner';
import AttachmentItem from './attachments/attachment-item';
import AttachmentUpload from './attachments/attachment-upload';

type props = {
  id: string;
};

export default function TaskDetails({ id }: props) {
  const { data, isPending, isError } = useTask(id);
  const createComment = useCreateComment();

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError || !data) {
    return <p>Failed to load task.</p>;
  }

  const task = data.data;

  const submitComment = (data: CreateCommentSchema) => {
    createComment.mutate(
      { taskId: task._id, data },
      {
        onSuccess: () => {
          toast.success('Comment added successfully');
        },
        onError: () => {
          toast.error('Failed to add comment');
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{task.title}</h1>

      <p>{task.description}</p>

      <p>Status: {task.status}</p>

      <p>Priority: {task.priority}</p>

      <p>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>

      <h2>Attachments</h2>
      <AttachmentUpload taskId={task._id} />

      <div className="mt-4 space-y-3">
        {task.attachments?.map((attachment) => (
          <AttachmentItem key={attachment._id} attachment={attachment} taskId={task._id} />
        ))}
      </div>

      <h2>Comments</h2>
      <CommentForm submitLabel="Add Comment" isSubmitting={createComment.isPending} onSubmit={submitComment} />

      <div className="mt-6 space-y-4">
        {task.comments?.map((comment) => (
          <CommentItem key={comment._id} comment={comment} taskId={task._id} />
        ))}
      </div>
    </div>
  );
}
