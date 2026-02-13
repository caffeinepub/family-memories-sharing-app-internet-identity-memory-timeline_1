import { useState } from 'react';
import MemoriesPage from './MemoriesPage';
import MemoryForm from './MemoryForm';
import MemoryDetail from './MemoryDetail';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import type { Memory } from '../../backend';

export default function MemoriesLayout() {
  const [showForm, setShowForm] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [viewingMemory, setViewingMemory] = useState<Memory | null>(null);

  const handleAddNew = () => {
    setEditingMemory(null);
    setShowForm(true);
  };

  const handleEdit = (memory: Memory) => {
    setEditingMemory(memory);
    setViewingMemory(null);
    setShowForm(true);
  };

  const handleView = (memory: Memory) => {
    setViewingMemory(memory);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMemory(null);
  };

  const handleDetailClose = () => {
    setViewingMemory(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Our Memories</h2>
          <p className="text-muted-foreground mt-1">A timeline of cherished moments</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Memory
        </Button>
      </div>

      <MemoriesPage onView={handleView} onEdit={handleEdit} />

      {/* Add/Edit Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMemory ? 'Edit Memory' : 'Add New Memory'}</DialogTitle>
          </DialogHeader>
          <MemoryForm memory={editingMemory} onClose={handleFormClose} />
        </DialogContent>
      </Dialog>

      {/* View Detail Dialog */}
      <Dialog open={!!viewingMemory} onOpenChange={(open) => !open && handleDetailClose()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {viewingMemory && (
            <MemoryDetail
              memory={viewingMemory}
              onClose={handleDetailClose}
              onEdit={() => handleEdit(viewingMemory)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
