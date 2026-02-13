import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useDeleteMemory } from '../../hooks/useMemories';
import { Button } from '../ui/button';
import { Calendar, Edit, Trash2, User } from 'lucide-react';
import { blobToUrl } from '../../lib/photo';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Alert, AlertDescription } from '../ui/alert';
import type { Memory } from '../../backend';

interface MemoryDetailProps {
  memory: Memory;
  onClose: () => void;
  onEdit: () => void;
}

export default function MemoryDetail({ memory, onClose, onEdit }: MemoryDetailProps) {
  const { identity } = useInternetIdentity();
  const deleteMemory = useDeleteMemory();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const isAuthor =
    identity && memory.author.toString() === identity.getPrincipal().toString();

  const memoryDate = new Date(Number(memory.timestamp) / 1000000);

  useEffect(() => {
    if (memory.photo) {
      const url = blobToUrl(memory.photo);
      setImageUrl(url);
      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    }
  }, [memory.photo]);

  const handleDelete = async () => {
    try {
      await deleteMemory.mutateAsync(memory.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete memory:', error);
    }
  };

  return (
    <div className="space-y-6">
      {imageUrl && (
        <div className="w-full overflow-hidden rounded-lg bg-muted">
          <img
            src={imageUrl}
            alt={memory.title}
            className="w-full object-contain max-h-96"
          />
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">{memory.title}</h2>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={memoryDate.toISOString()}>
              {memoryDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="truncate max-w-[200px]">
              {memory.author.toString().slice(0, 10)}...
            </span>
          </div>
        </div>

        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap text-foreground">{memory.content}</p>
        </div>
      </div>

      {deleteMemory.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {deleteMemory.error instanceof Error
              ? deleteMemory.error.message
              : 'Failed to delete memory. You can only delete your own memories.'}
          </AlertDescription>
        </Alert>
      )}

      {isAuthor && (
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={onEdit} variant="outline" className="flex-1">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex-1">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Memory?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this memory.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={deleteMemory.isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleteMemory.isPending ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
