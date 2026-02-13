import { useState, useMemo } from 'react';
import { useGetAllMemories } from '../../hooks/useMemories';
import MemoryCard from './MemoryCard';
import { Input } from '../ui/input';
import { Search, Calendar } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import type { Memory } from '../../backend';

interface MemoriesPageProps {
  onView: (memory: Memory) => void;
  onEdit: (memory: Memory) => void;
}

export default function MemoriesPage({ onView, onEdit }: MemoriesPageProps) {
  const { data: memories, isLoading, error } = useGetAllMemories();
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const filteredMemories = useMemo(() => {
    if (!memories) return [];

    let filtered = [...memories];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (memory) =>
          memory.title.toLowerCase().includes(query) ||
          memory.content.toLowerCase().includes(query)
      );
    }

    // Year filter
    if (yearFilter.trim()) {
      const year = parseInt(yearFilter);
      if (!isNaN(year)) {
        filtered = filtered.filter((memory) => {
          const memoryDate = new Date(Number(memory.timestamp) / 1000000);
          return memoryDate.getFullYear() === year;
        });
      }
    }

    // Sort by newest first
    return filtered.sort((a, b) => Number(b.timestamp - a.timestamp));
  }, [memories, searchQuery, yearFilter]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load memories. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search memories by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative w-full sm:w-40">
          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Year (e.g., 2024)"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Memories Grid */}
      {filteredMemories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {memories?.length === 0
              ? 'No memories yet. Create your first memory to get started!'
              : 'No memories match your search criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMemories.map((memory) => (
            <MemoryCard
              key={memory.id.toString()}
              memory={memory}
              onView={onView}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
