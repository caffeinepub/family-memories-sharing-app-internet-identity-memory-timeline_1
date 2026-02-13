import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, Eye, Edit } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { blobToUrl } from '../../lib/photo';
import { useEffect, useState } from 'react';
import type { Memory } from '../../backend';

interface MemoryCardProps {
  memory: Memory;
  onView: (memory: Memory) => void;
  onEdit: (memory: Memory) => void;
}

export default function MemoryCard({ memory, onView, onEdit }: MemoryCardProps) {
  const { identity } = useInternetIdentity();
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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={memory.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2">{memory.title}</CardTitle>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <time dateTime={memoryDate.toISOString()}>
            {memoryDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">{memory.content}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm" onClick={() => onView(memory)} className="flex-1">
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
        {isAuthor && (
          <Button variant="outline" size="sm" onClick={() => onEdit(memory)} className="flex-1">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
