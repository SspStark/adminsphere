'use client';

import Button from '@/components/ui/button';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';
import { useDeleteComment, useUpdateComment } from '@/hooks/use-tasks';
import { useAuthStore } from '@/store/auth.store';
import { TaskComment } from '@/types/task.types';
import { toast } from 'sonner';
import { useState } from 'react';
import { CreateCommentSchema } from '@/schemas/comment.schema';
import CommentForm from './comment-form';

type TaskCommentProps = {
  comment: TaskComment;
  taskId: string;
};

export default function CommentItem({ comment, taskId }: TaskCommentProps) {
  const author = [comment.user.firstName, comment.user.lastName].filter(Boolean).join(' ');
  const currentUser = useAuthStore((state) => state.user);
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  const canEdit = currentUser?._id === comment.user._id;
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{author || comment.user.username}</p>
          <p className="text-xs text-white/50">{new Date(comment.createdAt).toLocaleString()}</p>
        </div>
      </div>
      {isEditing ? (
        <CommentForm
          defaultValues={{
            message: comment.message,
          }}
          submitLabel="Save"
          isSubmitting={updateComment.isPending}
          onSubmit={(data: CreateCommentSchema) => {
            updateComment.mutate(
              {
                taskId,
                commentId: comment._id,
                data,
              },
              {
                onSuccess: () => {
                  toast.success('Comment updated');
                  setIsEditing(false);
                },
                onError: () => {
                  toast.error('Failed to update comment');
                },
              }
            );
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <p className="mt-3 whitespace-pre-wrap text-sm">{comment.message}</p>

          {canEdit && (
            <div className="mt-3 flex gap-2">
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
              <Button onClick={() => setShowDeleteDialog(true)}>Delete</Button>
            </div>
          )}
          <ConfirmationDialog
            open={showDeleteDialog}
            title="Delete Comment"
            description="Are you sure you want to delete this comment?"
            confirmLabel="Delete"
            isLoading={deleteComment.isPending}
            onOpenChange={setShowDeleteDialog}
            onConfirm={() => {
              deleteComment.mutate(
                {
                  taskId,
                  commentId: comment._id,
                },
                {
                  onSuccess: () => {
                    toast.success('Comment deleted');
                    setShowDeleteDialog(false);
                  },
                  onError: () => {
                    toast.error('Failed to delete comment');
                  },
                }
              );
            }}
          />
        </>
      )}
    </div>
  );
}
