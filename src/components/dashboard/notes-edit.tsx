import type React from 'react';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import { User } from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetNoteQuery,
  useUpdateNoteMutation,
} from '../../redux/features/admin/adminNotification';

interface EditNoteDialogProps {
  noteId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const EditNoteDialog = ({
  noteId,
  open,
  onOpenChange,
}: EditNoteDialogProps) => {
  const [noteContent, setNoteContent] = useState('');

  const { data, isLoading, error } = useGetNoteQuery(noteId!, {
    skip: !noteId || !open,
  });

  const note = data?.data?.[0];

  const [updateNote, { isLoading: isUpdating }] = useUpdateNoteMutation();

  // Set initial note content when data loads
  useEffect(() => {
    if (note?.user_admin_notes?.note) {
      setNoteContent(note.user_admin_notes.note);
    }
  }, [note]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setNoteContent('');
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateNote({
        id: noteId,
        data: noteContent,
      }).unwrap();

      toast.success('Note updated successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update note');
      console.error('Update error:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
          <DialogDescription>
            Update the administrative note for this user
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Error loading note</p>
          </div>
        ) : note ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={note?.user?.avatar || '/placeholder.svg'}
                  alt={note?.user?.name}
                />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{note?.user?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {note?.user?.email}
                </p>
              </div>
            </div>

            {/* Note Content */}
            <div className="space-y-2">
              <Label htmlFor="note-content">Note Content</Label>
              <Textarea
                id="note"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Enter administrative note..."
                rows={6}
                required
              />
              <p className="text-xs text-muted-foreground">
                {noteContent.length} characters
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !noteContent.trim() ||
                  isUpdating ||
                  noteContent === note?.user_admin_notes?.note
                }
              >
                {isUpdating ? 'Updating...' : 'Update Note'}
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default EditNoteDialog;
