'use client';

import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Search,
  Eye,
  MoreVertical,
  ScrollText,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import DeleteConfirmDialog from './notes-delete';
import AdminLogDetailsDialog from './admin-log-details';
import {
  useAdminLogDeleteMutation,
  useAdminLogsQuery,
} from '../../redux/features/admin/adminNotification';

interface AdminLog {
  id: string;
  adminId: string;
  action: string;
  entity: string;
  entityId: string;
  metadata: any | null;
  createdAt: string;
}

const AdminAuditLogsList = () => {
  const [currentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [pageSize] = useState(12);

  const skip = (currentPage - 1) * pageSize;
  const { data, isLoading, error, refetch } = useAdminLogsQuery({
    skip,
    take: pageSize,
  });

  const [deleteAdminLog, { isLoading: isDeleting }] =
    useAdminLogDeleteMutation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionBadgeVariant = (action: string) => {
    if (action.startsWith('CREATE')) return 'default';
    if (action.startsWith('UPDATE')) return 'secondary';
    if (action.startsWith('DELETE')) return 'destructive';
    return 'outline';
  };

  const handleViewDetails = (logId: string) => {
    setSelectedLogId(logId);
    setDetailsDialogOpen(true);
  };

  const handleDeleteLog = (logId: string) => {
    setSelectedLogId(logId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedLogId) return;

    try {
      await deleteAdminLog(selectedLogId).unwrap();
      toast.success('Log deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedLogId(null);
    } catch (error) {
      toast.error('Failed to delete log');
      console.error('Delete log error:', error);
    }
  };

  const filterLogs = (logs: AdminLog[]) => {
    return logs.filter((log) => {
      const matchesSearch =
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.adminId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'create' && log.action.startsWith('CREATE')) ||
        (activeTab === 'update' && log.action.startsWith('UPDATE')) ||
        (activeTab === 'delete' && log.action.startsWith('DELETE'));

      return matchesSearch && matchesTab;
    });
  };

  const logs = data?.data || [];
  const filteredLogs = filterLogs(logs);

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading audit logs</p>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-2" />
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
          <h1 className="text-2xl font-bold">Admin Audit Logs</h1>
          <p className="text-muted-foreground">
            Track administrative actions and system changes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <ScrollText className="h-3 w-3" />
            {logs.length} Total Logs
          </Badge>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by action, entity, or admin ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="all">All Actions</TabsTrigger>
                <TabsTrigger value="create">Create</TabsTrigger>
                <TabsTrigger value="update">Update</TabsTrigger>
                <TabsTrigger value="delete">Delete</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Logs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-9 w-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredLogs.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <ScrollText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No audit logs found</p>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? 'Try adjusting your search terms'
                      : 'No administrative actions have been logged yet'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <Card key={log.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {log.action.replace(/_/g, ' ')}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Entity: {log.entity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getActionBadgeVariant(log.action)}
                      className="text-xs"
                    >
                      {log.action.split('_')[0]}
                    </Badge>
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
                          onClick={() => handleViewDetails(log.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteLog(log.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Log
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Log Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Admin ID:</span>
                      <span className="font-mono text-xs">
                        {log.adminId.slice(0, 8)}...
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Entity ID:</span>
                      <span className="font-mono text-xs">
                        {log.entityId.slice(0, 8)}...
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Timestamp:</span>
                      <span className="font-medium">
                        {formatDate(log.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => handleViewDetails(log.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialogs */}
      {selectedLogId && (
        <AdminLogDetailsDialog
          logId={selectedLogId}
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
        />
      )}

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete Audit Log"
        description="Are you sure you want to delete this audit log entry? This action cannot be undone."
      />
    </div>
  );
};

export default AdminAuditLogsList;
