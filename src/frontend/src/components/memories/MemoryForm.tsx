import { useState, useEffect } from 'react';
import { useCreateMemory, useUpdateMemory } from '../../hooks/useMemories';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { Upload, X } from 'lucide-react';
import { validatePhoto, fileToBytes, blobToUrl } from '../../lib/photo';
import type { Memory } from '../../backend';

interface MemoryFormProps {
  memory?: Memory | null;
  onClose: () => void;
}

const MAX_FILE_SIZE_MB = 2;

export default function MemoryForm({ memory, onClose }: MemoryFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const createMemory = useCreateMemory();
  const updateMemory = useUpdateMemory();

  const isEditing = !!memory;

  useEffect(() => {
    if (memory) {
      setTitle(memory.title);
      setContent(memory.content);
      if (memory.photo) {
        const url = blobToUrl(memory.photo);
        setPhotoPreview(url);
      }
    }
  }, [memory]);

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validatePhoto(file, MAX_FILE_SIZE_MB);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    setPhotoFile(file);
    setRemovePhoto(false);

    // Create preview
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setRemovePhoto(true);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim()) {
      setValidationError('Title is required');
      return;
    }

    try {
      let photoBytes: Uint8Array | null = null;

      if (photoFile) {
        photoBytes = await fileToBytes(photoFile);
      } else if (isEditing && memory.photo && !removePhoto) {
        photoBytes = memory.photo;
      }

      if (isEditing && memory) {
        await updateMemory.mutateAsync({
          id: memory.id,
          title: title.trim(),
          content: content.trim(),
          photo: photoBytes,
        });
      } else {
        await createMemory.mutateAsync({
          title: title.trim(),
          content: content.trim(),
          photo: photoBytes,
        });
      }

      onClose();
    } catch (error) {
      setValidationError(
        error instanceof Error ? error.message : 'Failed to save memory'
      );
    }
  };

  const isPending = createMemory.isPending || updateMemory.isPending;
  const error = createMemory.error || updateMemory.error;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your memory a title..."
          disabled={isPending}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Description</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share the story behind this memory..."
          rows={6}
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo">
          Photo (optional, max {MAX_FILE_SIZE_MB}MB, PNG/JPEG/WebP)
        </Label>
        {photoPreview ? (
          <div className="relative">
            <img
              src={photoPreview}
              alt="Preview"
              className="w-full rounded-lg object-cover max-h-64"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemovePhoto}
              disabled={isPending}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <Label
              htmlFor="photo"
              className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
            >
              Click to upload a photo
            </Label>
            <Input
              id="photo"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handlePhotoChange}
              disabled={isPending}
              className="hidden"
            />
          </div>
        )}
      </div>

      {(validationError || error) && (
        <Alert variant="destructive">
          <AlertDescription>
            {validationError ||
              (error instanceof Error
                ? error.message
                : 'Failed to save memory. Please try again.')}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? 'Saving...' : isEditing ? 'Update Memory' : 'Create Memory'}
        </Button>
      </div>
    </form>
  );
}
