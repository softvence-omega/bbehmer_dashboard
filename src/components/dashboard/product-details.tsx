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
import {
  Package,
  CheckCircle,
  XCircle,
  Database,
  ExternalLink,
  Tag,
  Hash,
  FileText,
} from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useGetProductQuery } from '../../redux/features/admin/adminNotification';

interface ProductDetailsDialogProps {
  stripeProductId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dbProducts: any[];
  stripeProducts: any[];
}

export default function ProductDetailsDialog({
  stripeProductId,
  open,
  onOpenChange,
}: ProductDetailsDialogProps) {
  // const dbProduct = dbProducts.find((product) => product.stripeProductId === stripeProductId)
  // const stripeProduct = stripeProducts.find((product) => product.id === stripeProductId)

  const { data, isLoading: isLoadingDetails } = useGetProductQuery({
    id: stripeProductId,
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

  const formatUnixTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const parseFeatures = (features: string) => {
    try {
      if (typeof features === 'string') {
        return features.replace(/"/g, '').split(',').filter(Boolean);
      }
      return [];
    } catch {
      return [];
    }
  };

  const stripeProduct = data?.data;
  const dbProduct = data?.data;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Details: {data?.data?.name || data?.data?.name}
          </DialogTitle>
          <DialogDescription>
            Complete information about this product
          </DialogDescription>
        </DialogHeader>

        {isLoadingDetails ? (
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
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="database">Database Info</TabsTrigger>
              <TabsTrigger value="stripe">Stripe Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Main Info Card */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {stripeProduct?.name}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        Product ID: {stripeProductId}
                      </p>
                    </div>
                    <Badge
                      variant={stripeProduct?.active ? 'default' : 'secondary'}
                      className="text-sm"
                    >
                      {stripeProduct?.active ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-1" />
                      )}
                      {stripeProduct?.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Description */}
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Description
                      </h3>
                      <p className="text-muted-foreground">
                        {dbProduct?.description ||
                          stripeProduct?.description ||
                          'No description available'}
                      </p>
                    </div>

                    {/* Features */}
                    {dbProduct?.features && (
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          Features
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {parseFeatures(dbProduct.features).map(
                            (feature, index) => (
                              <Badge key={index} variant="outline">
                                {feature.trim()}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {/* Status Comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Database Status</h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Created:</span>
                            <span>
                              {dbProduct
                                ? formatDate(dbProduct.createdAt)
                                : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Updated:</span>
                            <span>
                              {dbProduct
                                ? formatDate(dbProduct.updatedAt)
                                : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Stripe Status</h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Active:</span>
                            <Badge
                              variant={
                                stripeProduct?.active ? 'default' : 'secondary'
                              }
                            >
                              {stripeProduct?.active ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Type:</span>
                            <span className="capitalize">
                              {stripeProduct?.type || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="database" className="space-y-6">
              {dbProduct ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Database Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-3">
                        <div>
                          <p className="text-muted-foreground">Product ID</p>
                          <p className="font-mono text-xs break-all">
                            {dbProduct.id}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            Stripe Product ID
                          </p>
                          <p className="font-mono text-xs break-all">
                            {dbProduct.stripeProductId}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Name</p>
                          <p className="font-medium">{dbProduct.name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Description</p>
                          <p className="font-medium">{dbProduct.description}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-muted-foreground">Features</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {parseFeatures(dbProduct.features).map(
                              (feature, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {feature.trim()}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Created At</p>
                          <p className="font-medium">
                            {formatDate(dbProduct.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Updated At</p>
                          <p className="font-medium">
                            {formatDate(dbProduct.updatedAt)}
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
                      No database information found for this product
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="stripe" className="space-y-6">
              {stripeProduct ? (
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
                            <p className="text-muted-foreground">Product ID</p>
                            <p className="font-mono text-xs">
                              {stripeProduct.id}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Object Type</p>
                            <p className="font-medium capitalize">
                              {stripeProduct.object}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Name</p>
                            <p className="font-medium">{stripeProduct.name}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Type</p>
                            <p className="font-medium capitalize">
                              {stripeProduct.type}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-muted-foreground">
                              Active Status
                            </p>
                            <Badge
                              variant={
                                stripeProduct.active ? 'default' : 'secondary'
                              }
                            >
                              {stripeProduct.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Live Mode</p>
                            <Badge
                              variant={
                                stripeProduct.livemode ? 'default' : 'secondary'
                              }
                            >
                              {stripeProduct.livemode ? 'Live' : 'Test'}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Created</p>
                            <p className="font-medium">
                              {formatUnixTimestamp(stripeProduct.created)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Updated</p>
                            <p className="font-medium">
                              {formatUnixTimestamp(stripeProduct.updated)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Description */}
                      <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-sm text-muted-foreground">
                          {stripeProduct.description ||
                            'No description provided'}
                        </p>
                      </div>

                      {/* Metadata */}
                      {stripeProduct.metadata &&
                        Object.keys(stripeProduct.metadata).length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Hash className="h-4 w-4" />
                                Stripe Metadata
                              </h3>
                              <div className="space-y-2">
                                {Object.entries(stripeProduct.metadata).map(
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

                      {/* Additional Details */}
                      <Separator />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">
                            Statement Descriptor
                          </p>
                          <p className="font-medium">
                            {stripeProduct.statement_descriptor || 'Not set'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Tax Code</p>
                          <p className="font-medium">
                            {stripeProduct.tax_code || 'Not set'}
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
                      No Stripe data found for this product
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
