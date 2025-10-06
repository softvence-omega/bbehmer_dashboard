'use client';

import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  Calendar,
  FileText,
  Shield,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import {
  useGetAllNotesQuery,
  useDeleteNoteMutation,
} from '../../redux/features/admin/adminNotification';
import { toast } from 'sonner'; // or your preferred toast library
import NoteDetailsDialog from './note-details';
import EditNoteDialog from './notes-edit';
import DeleteConfirmDialog from './notes-delete';

const UserAdminNotesList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize] = useState(10);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const offset = (currentPage - 1) * pageSize;
  const { data, isLoading, error } = useGetAllNotesQuery({
    limit: pageSize,
    offset: offset,
  });

  const [deleteNote, { isLoading: isDeleting }] = useDeleteNoteMutation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      ?.map((n) => n[0])
      ?.join('')
      ?.toUpperCase();
  };

  const filteredNotes =
    data?.data?.filter(
      (note: any) =>
        note?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note?.user_admin_notes?.note
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()),
    ) || [];

  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  const handleViewNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setViewDialogOpen(true);
  };

  const handleEditNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setEditDialogOpen(true);
  };

  const handleDeleteNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedNoteId) return;

    try {
      await deleteNote(selectedNoteId).unwrap();
      toast.success('Note deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedNoteId(null);
    } catch (error) {
      toast.error('Failed to delete note');
      console.error('Delete error:', error);
    }
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading notes</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Admin Notes</h1>
          <p className="text-muted-foreground">
            Manage and review administrative notes for users
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <FileText className="h-3 w-3" />
          {data?.total || 0} Total Notes
        </Badge>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by user name, email, note content, or admin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notes List */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No notes found</p>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : 'No admin notes have been created yet'}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredNotes.map((note: any) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* User Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={note?.user?.avatar || '/placeholder.svg'}
                          alt={note?.user?.name}
                        />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{note?.user?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {note?.user?.email}
                        </p>
                        <Badge
                          variant="outline"
                          className="md:hidden mt-1 flex items-center gap-1"
                        >
                          <Calendar className="h-3 w-3" />
                          {formatDate(note?.user_admin_notes?.createdAt)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="md:flex hidden items-center gap-1"
                      >
                        <Calendar className="h-3 w-3" />
                        {formatDate(note?.user_admin_notes?.createdAt)}
                      </Badge>

                      {/* Actions Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleViewNote(note?.user_admin_notes?.id)
                            }
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleEditNote(note?.user_admin_notes?.id)
                            }
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Note
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteNote(note?.user_admin_notes?.id)
                            }
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Note
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Note Content Preview */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm leading-relaxed line-clamp-3">
                      {note?.user_admin_notes?.note}
                    </p>
                    {note?.user_admin_notes?.note?.length > 150 && (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto mt-2"
                        onClick={() => handleViewNote(note.id)}
                      >
                        Read more...
                      </Button>
                    )}
                  </div>

                  {/* Admin Info */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>Added by:</span>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={note?.admin?.avatar || '/placeholder.svg'}
                            alt={note?.admin?.name}
                          />
                          <AvatarFallback className="text-xs">
                            {getInitials(note?.admin?.name || 'Admin')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">
                          {note?.admin?.name ||
                            `Admin ID: ${note?.user_admin_notes?.adminId}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {!isLoading && data?.total && data.total > pageSize && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {offset + 1} to{' '}
                {Math.min(offset + pageSize, data.total)} of {data.total} notes
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="px-2">...</span>
                      <Button
                        variant={
                          currentPage === totalPages ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-8 h-8 p-0"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      {selectedNoteId && (
        <NoteDetailsDialog
          noteId={selectedNoteId}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
        />
      )}

      <EditNoteDialog
        noteId={selectedNoteId}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};
export default UserAdminNotesList;
