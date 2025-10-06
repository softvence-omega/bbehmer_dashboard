import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import {
  Loader2,
  Plus,
  Trash2,
  Edit,
  Eye,
  Search,
  AlertCircle,
  CheckCircle,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';
import {
  useCreateAdminMutation,
  useCreateSuperAdminMutation,
  useDeleteAdminMutation,
  useGetAdminManagementQuery,
  useUpdateAdminDetailsMutation,
} from '../../redux/features/admin/adminManagementApi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { TRole } from '../../redux/features/auth/authSlice';

// Admin type definition based on the provided API response
type Admin = {
  id: string;
  name: string;
  email: string;
  password?: string;
  xp: number;
  ipAddress: string;
  isIpBan: boolean;
  createdAt: string;
  subscriptionPlan: string;
  planStartedAt: string;
  fcmToken: string | null;
  role: TRole;
  isLogIn: boolean;
  lastLoginAt: string;
  isSuspend: boolean;
};

// Form schema for creating/editing admins
const adminFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
});

type AdminFormData = z.infer<typeof adminFormSchema>;

const AdminManagement = () => {
  // Sample data from the API response
  //   const {data} = useGetAdminManagementQuery(undefined)
  //   const admins = data?.data
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // UI state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<{
    open: boolean;
    type: TRole;
  }>({
    open: false,
    type: TRole.ADMIN,
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [createAdmin] = useCreateAdminMutation();
  const [createSuperAdmin] = useCreateSuperAdminMutation();
  const [updateAdmin] = useUpdateAdminDetailsMutation();
  const [deleteAdmin] = useDeleteAdminMutation();

  // Calculate skip value for pagination
  const skip = (currentPage - 1) * pageSize;

  // Prepare query parameters
  const queryParams = useMemo(() => {
    const params = [
      { name: 'skip', value: skip.toString() },
      { name: 'take', value: pageSize.toString() },
    ];

    if (debouncedSearchTerm) {
      params.push({ name: 'search', value: debouncedSearchTerm });
    }

    return params;
  }, [skip, pageSize, debouncedSearchTerm]);

  // RTK Query hook
  const {
    data: adminResponse,
    isLoading: isLoadingAdmins,
    isError,
    refetch,
  } = useGetAdminManagementQuery(queryParams);

  // Debounce search term
  useState(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  });

  // Extract data from response
  const admins = adminResponse?.data || [];
  const totalCount = adminResponse?.totalCount || 0;
  const totalPages = adminResponse?.totalPages || 1;

  // Forms for create and edit
  const createForm = useForm<AdminFormData>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const editForm = useForm<AdminFormData>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  // Pagination handlers
  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const goToNextPage = () =>
    setCurrentPage(Math.min(totalPages, currentPage + 1));
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPage = (page: number) =>
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));

  // Handle page size change
  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number.parseInt(newPageSize));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Create new admin
  const handleCreateAdmin = async (data: AdminFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      if (isCreateModalOpen.type === TRole.SUPERADMIN) {
        await createSuperAdmin(data);
      } else if (isCreateModalOpen.type === TRole.ADMIN) {
        await createAdmin(data);
      }

      showNotification('success', 'Admin created successfully');
      setIsCreateModalOpen({ open: false, type: TRole.ADMIN });
      createForm.reset();
      refetch(); // Refetch the admin list
    } catch (error) {
      showNotification('error', 'Failed to create admin');
      console.error('Create admin error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update admin
  const handleUpdateAdmin = async (data: AdminFormData) => {
    if (!selectedAdmin) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await updateAdmin(data);

      // In real implementation, you would call your update admin mutation here
      // await updateAdminMutation({ id: selectedAdmin.id, ...data })

      showNotification('success', 'Admin updated successfully');
      setIsEditModalOpen(false);
      refetch(); // Refetch the admin list
    } catch (error) {
      showNotification('error', 'Failed to update admin');
      console.error('Update admin error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete admin
  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await deleteAdmin({ id: selectedAdmin.id });

      // In real implementation, you would call your delete admin mutation here
      // await deleteAdminMutation(selectedAdmin.id)

      showNotification('success', 'Admin deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedAdmin(null);
      refetch(); // Refetch the admin list
    } catch (error) {
      showNotification('error', 'Failed to delete admin');
      console.error('Delete admin error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Open edit modal with admin data
  const openEditModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    editForm.reset({
      name: admin.name,
      email: admin.email,
      password: '', // Placeholder for password
    });
    setIsEditModalOpen(true);
  };

  // Open view modal with admin data
  const openViewModal = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsViewModalOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsDeleteDialogOpen(true);
  };

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';

    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate pagination info
  const startItem = skip + 1;
  const endItem = Math.min(skip + pageSize, totalCount);

  return (
    <div className="container mx-auto py-6 space-y-6 p-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Management</h1>
        <div className="flex gap-2">
          {/* add super admin */}
          <Button
            onClick={() =>
              setIsCreateModalOpen({
                open: true,
                type: TRole.SUPERADMIN,
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Super Admin
          </Button>

          <Button
            onClick={() =>
              setIsCreateModalOpen({
                open: true,
                type: TRole.ADMIN,
              })
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Admin
          </Button>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <Alert
          className={`${notification.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription
            className={`${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}
          >
            {notification.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Search and Page Size Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search admins by name or email"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="pageSize" className="text-sm">
            Show:
          </Label>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Admin Table */}
      <Card>
        <CardHeader>
          <CardTitle>Admins</CardTitle>
          <CardDescription>
            {totalCount > 0
              ? `Showing ${startItem} to ${endItem} of ${totalCount} admins`
              : 'No admins found'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingAdmins ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading admins...</span>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-8">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <span className="ml-2 text-red-500">Failed to load admins</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.length > 0 ? (
                  admins.map((admin: Admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">
                        {admin.name}
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        {admin.isLogIn ? (
                          <Badge className="bg-green-500">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            admin.subscriptionPlan === 'pro'
                              ? 'bg-purple-500'
                              : 'bg-gray-500'
                          }
                        >
                          {admin.role === 'superadmin'
                            ? 'Super Admin'
                            : 'Admin'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(admin.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openViewModal(admin)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEditModal(admin)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => openDeleteDialog(admin)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-500"
                    >
                      No admins found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>

        {/* Pagination */}
        {totalPages > 1 && (
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t p-4">
            <div className="text-sm text-gray-500">
              Showing {startItem} to {endItem} of {totalCount} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToFirstPage}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={
                        currentPage === pageNumber ? 'default' : 'outline'
                      }
                      size="icon"
                      onClick={() => goToPage(pageNumber)}
                      className="w-10 h-10"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToLastPage}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Create Admin Modal */}
      <Dialog
        open={isCreateModalOpen.open}
        onOpenChange={() =>
          setIsCreateModalOpen({
            open: false,
            type: TRole.USER,
          })
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Create New {isCreateModalOpen.type.toUpperCase()}
            </DialogTitle>
            <DialogDescription>
              Add a new {isCreateModalOpen.type.toUpperCase()} to the system
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(handleCreateAdmin)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...createForm.register('name')}
                  className={
                    createForm.formState.errors.name ? 'border-red-500' : ''
                  }
                />
                {createForm.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {createForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  {...createForm.register('email')}
                  className={
                    createForm.formState.errors.email ? 'border-red-500' : ''
                  }
                />
                {createForm.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {createForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...createForm.register('password')}
                  className={
                    createForm.formState.errors.password ? 'border-red-500' : ''
                  }
                />
                {createForm.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {createForm.formState.errors.password.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Password must contain at least 8 characters with uppercase,
                  lowercase, and numbers
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen({ open: false, type: TRole.ADMIN });
                  createForm.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  `Create ${isCreateModalOpen.type}`
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
            <DialogDescription>Update admin information</DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleUpdateAdmin)}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  placeholder="John Doe"
                  {...editForm.register('name')}
                  className={
                    editForm.formState.errors.name ? 'border-red-500' : ''
                  }
                />
                {editForm.formState.errors.name && (
                  <p className="text-sm text-red-500">
                    {editForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="john@example.com"
                  {...editForm.register('email')}
                  className={
                    editForm.formState.errors.email ? 'border-red-500' : ''
                  }
                />
                {editForm.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {editForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password">
                  New Password (leave unchanged to keep current)
                </Label>
                <Input
                  id="edit-password"
                  type="password"
                  placeholder="••••••••"
                  {...editForm.register('password')}
                  className={
                    editForm.formState.errors.password ? 'border-red-500' : ''
                  }
                />
                {editForm.formState.errors.password && (
                  <p className="text-sm text-red-500">
                    {editForm.formState.errors.password.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Leave as is to keep current password, or enter a new password
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Admin'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the admin account for{' '}
              <span className="font-semibold">{selectedAdmin?.name}</span>. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAdmin}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Admin Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Admin Details</DialogTitle>
            <DialogDescription>
              Detailed information about this admin
            </DialogDescription>
          </DialogHeader>
          {selectedAdmin && (
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="subscription">Subscription</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-500">Name</Label>
                    <p className="font-medium">{selectedAdmin.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Email</Label>
                    <p className="font-medium">{selectedAdmin.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">
                      Admin Status
                    </Label>
                    <p className="font-medium">
                      {selectedAdmin.role === 'superadmin'
                        ? 'Super Admin'
                        : 'Admin'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">
                      Account Status
                    </Label>
                    <p className="font-medium">
                      {selectedAdmin.isSuspend ? 'Suspended' : 'Active'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">IP Address</Label>
                    <p className="font-medium">{selectedAdmin.ipAddress}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">
                      IP Ban Status
                    </Label>
                    <p className="font-medium">
                      {selectedAdmin.isIpBan ? 'Banned' : 'Not Banned'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Created At</Label>
                    <p className="font-medium">
                      {formatDate(selectedAdmin.createdAt)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">XP Points</Label>
                    <p className="font-medium">{selectedAdmin.xp}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="subscription" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-500">
                      Subscription Plan
                    </Label>
                    <p className="font-medium capitalize">
                      {selectedAdmin.subscriptionPlan}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">
                      Plan Started
                    </Label>
                    <p className="font-medium">
                      {formatDate(selectedAdmin.planStartedAt)}
                    </p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="activity" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-500">
                      Login Status
                    </Label>
                    <p className="font-medium">
                      {selectedAdmin.isLogIn ? 'Logged In' : 'Logged Out'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Last Login</Label>
                    <p className="font-medium">
                      {formatDate(selectedAdmin.lastLoginAt)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">FCM Token</Label>
                    <p className="font-medium text-xs truncate">
                      {selectedAdmin.fcmToken
                        ? selectedAdmin.fcmToken.substring(0, 20) + '...'
                        : 'Not available'}
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminManagement;
