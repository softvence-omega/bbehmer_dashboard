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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';
import {
  Users,
  CheckCircle,
  XCircle,
  Database,
  ExternalLink,
  Shield,
  Crown,
  Ban,
  CreditCard,
  Calendar,
  Mail,
  Hash,
  DollarSign,
  Activity,
} from 'lucide-react';
import { useGetCustomerDetailsQuery } from '../../redux/features/admin/adminNotification';

interface CustomerDetailsDialogProps {
  stripeCustomerId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CustomerDetailsDialog({
  stripeCustomerId,
  open,
  onOpenChange,
}: CustomerDetailsDialogProps) {
  const {
    data: customerDetails,
    isLoading,
    error,
  } = useGetCustomerDetailsQuery(stripeCustomerId!);

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

  const formatUnixTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan?.toLowerCase()) {
      case 'pro':
      case 'premium':
        return 'default';
      case 'free':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (!stripeCustomerId) return null;

  const dbCustomer = customerDetails?.data?.db?.[0];
  const stripeCustomer = customerDetails?.data?.stripe;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Details: {dbCustomer?.name || stripeCustomer?.name}
          </DialogTitle>
          <DialogDescription>
            Complete information about this customer
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Error loading customer details</p>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="database">Database Info</TabsTrigger>
              <TabsTrigger value="stripe">Stripe Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Customer Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={`/placeholder.svg?height=64&width=64`}
                        alt={dbCustomer?.name}
                      />
                      <AvatarFallback className="text-lg">
                        {getInitials(
                          dbCustomer?.name || stripeCustomer?.name || 'U',
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-2xl font-bold">
                          {dbCustomer?.name || stripeCustomer?.name}
                        </h2>
                        {dbCustomer?.isAdmin && (
                          <Crown className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-3">
                        <Mail className="h-4 w-4" />
                        <span>
                          {dbCustomer?.email || stripeCustomer?.email}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {dbCustomer && (
                          <Badge
                            variant={getPlanBadgeVariant(
                              dbCustomer.subscriptionPlan,
                            )}
                          >
                            <CreditCard className="h-3 w-3 mr-1" />
                            {dbCustomer.subscriptionPlan}
                          </Badge>
                        )}
                        {dbCustomer?.isLogIn !== undefined && (
                          <Badge
                            variant={
                              dbCustomer.isLogIn ? 'default' : 'secondary'
                            }
                          >
                            {dbCustomer.isLogIn ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {dbCustomer.isLogIn ? 'Online' : 'Offline'}
                          </Badge>
                        )}
                        {dbCustomer?.isSuspend && (
                          <Badge variant="destructive">
                            <Ban className="h-3 w-3 mr-1" />
                            Suspended
                          </Badge>
                        )}
                        {dbCustomer?.isAdmin && (
                          <Badge variant="outline">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {dbCustomer?.xp !== undefined && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            XP Points
                          </p>
                          <p className="text-2xl font-bold">
                            {dbCustomer.xp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {stripeCustomer?.balance !== undefined && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Stripe Balance
                          </p>
                          <p className="text-2xl font-bold">
                            $
                            {stripeCustomer.balance === 0
                              ? '0.00'
                              : (stripeCustomer.balance / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {stripeCustomer?.next_invoice_sequence && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-purple-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Next Invoice #
                          </p>
                          <p className="text-2xl font-bold">
                            {stripeCustomer.next_invoice_sequence}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {dbCustomer?.createdAt && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Member Since
                          </p>
                          <p className="text-sm font-bold">
                            {formatDate(dbCustomer.createdAt).split(',')[0]}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Account Activity */}
              {dbCustomer && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Account Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-3">
                        <div>
                          <p className="text-muted-foreground">
                            Account Created
                          </p>
                          <p className="font-medium">
                            {formatDate(dbCustomer.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Last Login</p>
                          <p className="font-medium">
                            {formatDate(dbCustomer.lastLoginAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Plan Started</p>
                          <p className="font-medium">
                            {formatDate(dbCustomer.planStartedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-muted-foreground">IP Address</p>
                          <p className="font-medium font-mono">
                            {dbCustomer.ipAddress}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            Subscription ID
                          </p>
                          <p className="font-medium font-mono text-xs">
                            {dbCustomer.stripeSubscriptionId ||
                              'No active subscription'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">FCM Token</p>
                          <p
                            className="font-medium font-mono text-xs truncate"
                            title={dbCustomer.fcmToken}
                          >
                            {dbCustomer.fcmToken
                              ? `${dbCustomer.fcmToken.substring(0, 20)}...`
                              : 'Not set'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="database" className="space-y-6">
              {dbCustomer ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Database Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div className="space-y-4">
                        <div>
                          <p className="text-muted-foreground">Customer ID</p>
                          <p className="font-mono text-xs break-all">
                            {dbCustomer.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Name</p>
                          <p className="font-medium">{dbCustomer.name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Email</p>
                          <p className="font-medium">{dbCustomer.email}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">XP Points</p>
                          <p className="font-medium">
                            {dbCustomer.xp.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">IP Address</p>
                          <p className="font-mono">{dbCustomer.ipAddress}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-muted-foreground">
                            Subscription Plan
                          </p>
                          <Badge
                            variant={getPlanBadgeVariant(
                              dbCustomer.subscriptionPlan,
                            )}
                          >
                            {dbCustomer.subscriptionPlan}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            Account Status
                          </p>
                          <div className="flex gap-2">
                            <Badge
                              variant={
                                dbCustomer.isLogIn ? 'default' : 'secondary'
                              }
                            >
                              {dbCustomer.isLogIn ? 'Online' : 'Offline'}
                            </Badge>
                            {dbCustomer.isSuspend && (
                              <Badge variant="destructive">Suspended</Badge>
                            )}
                            {dbCustomer.isAdmin && (
                              <Badge variant="outline">Admin</Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            Stripe Customer ID
                          </p>
                          <p className="font-mono text-xs">
                            {dbCustomer.stripeCustomerId}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            Stripe Subscription ID
                          </p>
                          <p className="font-mono text-xs">
                            {dbCustomer.stripeSubscriptionId || 'None'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-32">
                    <p className="text-muted-foreground">
                      No database information found
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="stripe" className="space-y-6">
              {stripeCustomer ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Stripe Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-3">
                          <div>
                            <p className="text-muted-foreground">Customer ID</p>
                            <p className="font-mono text-xs">
                              {stripeCustomer.id}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Name</p>
                            <p className="font-medium">{stripeCustomer.name}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="font-medium">
                              {stripeCustomer.email}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Balance</p>
                            <p className="font-medium">
                              $
                              {stripeCustomer.balance === 0
                                ? '0.00'
                                : (stripeCustomer.balance / 100).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-muted-foreground">Currency</p>
                            <p className="font-medium">
                              {stripeCustomer.currency?.toUpperCase() ||
                                'Not set'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Delinquent</p>
                            <Badge
                              variant={
                                stripeCustomer.delinquent
                                  ? 'destructive'
                                  : 'default'
                              }
                            >
                              {stripeCustomer.delinquent ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Tax Exempt</p>
                            <p className="font-medium capitalize">
                              {stripeCustomer.tax_exempt}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Created</p>
                            <p className="font-medium">
                              {formatUnixTimestamp(stripeCustomer.created)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Invoice Settings */}
                      <div>
                        <h3 className="font-semibold mb-3">Invoice Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">
                              Invoice Prefix
                            </p>
                            <p className="font-medium">
                              {stripeCustomer.invoice_prefix}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Next Invoice Sequence
                            </p>
                            <p className="font-medium">
                              {stripeCustomer.next_invoice_sequence}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Metadata */}
                      {stripeCustomer.metadata &&
                        Object.keys(stripeCustomer.metadata).length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Hash className="h-4 w-4" />
                                Metadata
                              </h3>
                              <div className="space-y-2">
                                {Object.entries(stripeCustomer.metadata).map(
                                  ([key, value]) => (
                                    <div
                                      key={key}
                                      className="flex justify-between text-sm"
                                    >
                                      <span className="text-muted-foreground">
                                        {key}:
                                      </span>
                                      <span className="font-medium">
                                        {String(value)}
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-32">
                    <p className="text-muted-foreground">
                      No Stripe data found for this customer
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
