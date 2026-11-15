'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useAddAttachment } from '@/hooks/use-tasks';

type AddAttachmentProps = {
  taskId: string;
};

export default function AttachmentUpload({ taskId }: AddAttachmentProps) {
  const [files, setFiles] = useState<File[]>([]);

  const addAttachment = useAddAttachment();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    if (files.length === 0) return;

    addAttachment.mutate(
      { taskId, files },
      {
        onSuccess: () => {
          toast.success('Attachment uploaded successfully');
          setFiles([]);
          if (inputRef.current) {
            inputRef.current.value = '';
          }
        },
        onError: () => {
          toast.error('Failed to upload attachment');
        },
      }
    );
  };

  return (
    <div className="flex space-y-3 gap-2">
      <Input
        ref={inputRef}
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        placeholder="Add attachments"
      />
      <Button type="button" onClick={handleUpload} disabled={addAttachment.isPending || files.length === 0}>
        {addAttachment.isPending ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
  );
}
