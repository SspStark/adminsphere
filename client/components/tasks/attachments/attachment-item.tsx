'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import Button from '@/components/ui/button';
import ConfirmationDialog from '@/components/ui/confirmation-dialog';

import { useDeleteAttachment } from '@/hooks/use-tasks';
import { TaskAttachment } from '@/types/task.types';
import { getErrorMessage } from '@/lib/get-error-message';

type AttachmentItemProps = {
  attachment: TaskAttachment;
  taskId: string;
};

export default function AttachmentItem({ taskId, attachment }: AttachmentItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const deleteAttachment = useDeleteAttachment();

  return (
    <>
      <div className="flex items-center gap-2 ">
        <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="underline">
          {attachment.fileName}
        </a>
        <Button type="button" onClick={() => setShowDeleteDialog(true)}>
          Delete
        </Button>
      </div>
      <ConfirmationDialog
        open={showDeleteDialog}
        title="Delete Attachment"
        description="Are you sure you want to delete this attachment?"
        confirmLabel="Delete"
        isLoading={deleteAttachment.isPending}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => {
          deleteAttachment.mutate(
            { taskId, attachmentId: attachment._id },
            {
              onSuccess: () => {
                toast.success('Attachment deleted');
                setShowDeleteDialog(false);
              },
              onError: (error) => {
                toast.error(getErrorMessage(error));
                setShowDeleteDialog(false);
              },
            }
          );
        }}
      />
    </>
  );
}
