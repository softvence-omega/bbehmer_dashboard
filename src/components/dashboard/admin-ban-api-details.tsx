'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';
import {
  Shield,
  Ban,
  Clock,
  AlertTriangle,
  XCircle,
  Calendar,
  Hash,
  FileText,
} from 'lucide-react';
import { useAdminGetBanIpDetailsQuery } from '../../redux/features/admin/adminNotification';

interface BanDetailsDialogProps {
  banId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BanDetailsDialog({
  banId,
  open,
  onOpenChange,
}: BanDetailsDialogProps) {
  const {
    data: banDetails,
    isLoading,
    error,
  } = useAdminGetBanIpDetailsQuery(banId!, {
    skip: !banId || !open,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };
  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getTimeRemaining = (expiresAt: string | null) => {
    if (!expiresAt) return 'Permanent ban';

    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} days, ${hours} hours remaining`;
    if (hours > 0) return `${hours} hours, ${minutes} minutes remaining`;
    if (minutes > 0) return `${minutes} minutes remaining`;
    return 'Less than 1 minute remaining';
  };

  const getBanStatus = (ban: any) => {
    if (!ban?.expiresAt) return 'permanent';
    if (isExpired(ban.expiresAt)) return 'expired';
    return 'active';
  };

  if (!banId) return null;

  const ban = banDetails?.data?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Ban Details: {ban?.ip || 'Loading...'}
          </DialogTitle>
          <DialogDescription>
            Complete information about this banned entity
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Error loading ban details</p>
          </div>
        ) : ban ? (
          <div className="space-y-6">
            {/* Ban Header */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-mono">
                      {ban.ip}
                    </CardTitle>
                    <p className="text-muted-foreground">Ban ID: {ban.id}</p>
                  </div>
                  <Badge
                    variant={
                      getBanStatus(ban) === 'active'
                        ? 'destructive'
                        : getBanStatus(ban) === 'permanent'
                          ? 'default'
                          : 'secondary'
                    }
                    className="text-sm"
                  >
                    {getBanStatus(ban) === 'active' && (
                      <Ban className="h-4 w-4 mr-1" />
                    )}
                    {getBanStatus(ban) === 'permanent' && (
                      <AlertTriangle className="h-4 w-4 mr-1" />
                    )}
                    {getBanStatus(ban) === 'expired' && (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    {getBanStatus(ban) === 'active'
                      ? 'Active Ban'
                      : getBanStatus(ban) === 'permanent'
                        ? 'Permanent Ban'
                        : 'Expired Ban'}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Ban Reason */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Ban Reason
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{ban.reason}</p>
              </CardContent>
            </Card>

            {/* Time Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Created
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">
                    {formatDate(ban.createdAt)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Duration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">
                    {getTimeRemaining(ban.expiresAt)}
                  </p>
                  {ban.expiresAt && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Expires: {formatDate(ban.expiresAt)}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Technical Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Technical Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ban ID:</span>
                    <span className="font-mono text-xs">{ban.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IP Address:</span>
                    <span className="font-mono">{ban.ip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge
                      variant={
                        getBanStatus(ban) === 'active'
                          ? 'destructive'
                          : getBanStatus(ban) === 'permanent'
                            ? 'default'
                            : 'secondary'
                      }
                    >
                      {getBanStatus(ban) === 'active'
                        ? 'Active'
                        : getBanStatus(ban) === 'permanent'
                          ? 'Permanent'
                          : 'Expired'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span>{ban.expiresAt ? 'Temporary' : 'Permanent'}</span>
                  </div>
                  {ban.expiresAt && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Expires At:
                        </span>
                        <span className="font-medium">
                          {formatDate(ban.expiresAt)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Time Remaining:
                        </span>
                        <span className="font-medium">
                          {getTimeRemaining(ban.expiresAt)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
