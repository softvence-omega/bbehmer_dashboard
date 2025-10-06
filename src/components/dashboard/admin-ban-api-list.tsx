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
  Shield,
  Plus,
  RefreshCw,
  Ban,
  Clock,
  Trash2,
  Edit,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import BanDetailsDialog from './admin-ban-api-details';
import CreateBanDialog from './admin-ban-api-create';
import DeleteConfirmDialog from './notes-delete';
import { toast } from 'sonner';
import {
  useAdminGetAllIdBanQuery,
  useDeleteBanIpMutation,
} from '../../redux/features/admin/adminNotification';

interface BanEntity {
  id: string;
  ip: string;
  reason: string;
  expiresAt: string | null;
  createdAt: string;
}

const BanManagementList = () => {
  const [currentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBanId, setSelectedBanId] = useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [pageSize] = useState(12);

  const skip = (currentPage - 1) * pageSize;
  const { data, isLoading, error, refetch } = useAdminGetAllIdBanQuery({
    skip,
    take: pageSize,
  });

  const [deleteBan, { isLoading: isDeleting }] = useDeleteBanIpMutation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getTimeRemaining = (expiresAt: string | null) => {
    if (!expiresAt) return 'Permanent';

    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return '< 1h';
  };

  const getBanStatus = (ban: BanEntity) => {
    if (!ban.expiresAt) return 'permanent';
    if (isExpired(ban.expiresAt)) return 'expired';
    return 'active';
  };

  const handleViewDetails = (banId: string) => {
    setSelectedBanId(banId);
    setDetailsDialogOpen(true);
  };

  const handleDeleteBan = (banId: string) => {
    setSelectedBanId(banId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBanId) return;

    try {
      await deleteBan(selectedBanId).unwrap();
      toast.success('Ban removed successfully');
      setDeleteDialogOpen(false);
      setSelectedBanId(null);
    } catch (error) {
      toast.error('Failed to remove ban');
      console.error('Delete ban error:', error);
    }
  };

  const filterBans = (bans: BanEntity[]) => {
    return bans.filter((ban) => {
      const matchesSearch =
        ban.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ban.reason.toLowerCase().includes(searchTerm.toLowerCase());

      const status = getBanStatus(ban);
      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'active' && status === 'active') ||
        (activeTab === 'permanent' && status === 'permanent') ||
        (activeTab === 'expired' && status === 'expired');

      return matchesSearch && matchesTab;
    });
  };

  const bans = data?.data || [];
  const filteredBans = filterBans(bans);

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading bans</p>
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
          <h1 className="text-2xl font-bold">Ban Management</h1>
          <p className="text-muted-foreground">
            Manage IP bans and blocked entities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {bans.length} Total Bans
          </Badge>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Ban
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
                placeholder="Search by IP address or reason..."
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
                <TabsTrigger value="all">All Bans</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="permanent">Permanent</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Bans Grid */}
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
        ) : filteredBans.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No bans found</p>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? 'Try adjusting your search terms'
                      : 'No IP addresses have been banned yet'}
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Ban
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredBans.map((ban) => {
            const status = getBanStatus(ban);
            const timeRemaining = getTimeRemaining(ban.expiresAt);

            return (
              <Card key={ban.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-mono">
                        {ban.ip}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        ID: {ban.id.slice(0, 8)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          status === 'active'
                            ? 'destructive'
                            : status === 'permanent'
                              ? 'default'
                              : 'secondary'
                        }
                      >
                        {status === 'active' && (
                          <Ban className="h-3 w-3 mr-1" />
                        )}
                        {status === 'permanent' && (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {status === 'expired' && (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {status === 'active'
                          ? 'Active'
                          : status === 'permanent'
                            ? 'Permanent'
                            : 'Expired'}
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
                            onClick={() => handleViewDetails(ban.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Ban
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteBan(ban.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Ban
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Reason */}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Reason
                      </p>
                      <p className="text-sm font-medium line-clamp-2">
                        {ban.reason}
                      </p>
                    </div>

                    {/* Time Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Created</p>
                        <p className="font-medium">
                          {formatDate(ban.createdAt)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          {ban.expiresAt ? 'Time Left' : 'Duration'}
                        </p>
                        <div className="flex items-center gap-1">
                          {status === 'permanent' && (
                            <AlertTriangle className="h-3 w-3 text-orange-500" />
                          )}
                          {status === 'active' && (
                            <Clock className="h-3 w-3 text-blue-500" />
                          )}
                          {status === 'expired' && (
                            <XCircle className="h-3 w-3 text-gray-500" />
                          )}
                          <span className="font-medium">{timeRemaining}</span>
                        </div>
                      </div>
                    </div>

                    {/* Expiry Date */}
                    {ban.expiresAt && (
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">
                            Expires:
                          </span>
                          <span className="font-medium">
                            {formatDate(ban.expiresAt)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => handleViewDetails(ban.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Dialogs */}
      <BanDetailsDialog
        banId={selectedBanId}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
      />

      <CreateBanDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Remove Ban"
        description="Are you sure you want to remove this ban? The IP address will be able to access the system again."
      />
    </div>
  );
};

export default BanManagementList;
