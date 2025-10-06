import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Search,
  Eye,
  Package,
  Plus,
  RefreshCw,
  CheckCircle,
  XCircle,
  Calendar,
  Hash,
  Tag,
  FileText,
} from 'lucide-react';
import { useGetAllProductQuery } from '../../redux/features/admin/adminNotification';

interface StripeProduct {
  trim(): import('react').ReactNode;
  id: string;
  object: string;
  active: boolean;
  attributes: any[];
  created: number;
  default_price: string | null;
  description: string;
  images: string[];
  livemode: boolean;
  marketing_features: any[];
  metadata: Record<string, any>;
  name: string;
  package_dimensions: any;
  shippable: boolean | null;
  statement_descriptor: string | null;
  tax_code: string | null;
  type: string;
  unit_label: string | null;
  updated: number;
  url: string | null;
  feature: string | null;
}

const StripeProductsList = () => {
  const [currentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<StripeProduct | null>(
    null,
  );
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [pageSize] = useState(12);

  const skip = (currentPage - 1) * pageSize;

  const { data, isLoading, error, refetch } = useGetAllProductQuery({
    skip,
    take: pageSize,
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const parseFeatures = (metadata: any) => {
    try {
      if (metadata?.features) {
        // Remove extra quotes and parse
        const features = metadata.features.replace(/"/g, '');
        return features.split(',').filter(Boolean);
      }
      return [];
    } catch {
      return [];
    }
  };

  const handleViewDetails = (product: StripeProduct) => {
    setSelectedProduct(product);
    setDetailsDialogOpen(true);
  };

  const filterProducts = (products: StripeProduct[]) => {
    return products?.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTab =
        activeTab === 'all' ||
        (activeTab === 'active' && product.active) ||
        (activeTab === 'inactive' && !product.active);

      return matchesSearch && matchesTab;
    });
  };

  const stripeProducts = data?.data || [];
  const filteredProducts = filterProducts(stripeProducts);

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-2">Error loading products</p>
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
          <h1 className="text-2xl font-bold">Products Management</h1>
          <p className="text-muted-foreground">
            Manage your subscription products and services
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Package className="h-3 w-3" />
            {stripeProducts.length} Total Products
          </Badge>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Product
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
                placeholder="Search by name, description, ID, or type..."
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
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
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
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-9 w-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No products found</p>
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? 'Try adjusting your search terms'
                      : 'No products have been created yet'}
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const features = parseFeatures(product.metadata);
            return (
              <Card
                key={product.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {product.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground truncate">
                        ID: {product.id.substring(0, 10)}...
                        {product.id.substring(product.id.length - 6)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Badge variant={product.active ? 'default' : 'secondary'}>
                        {product.active ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {product.active ? 'Active' : 'Inactive'}
                      </Badge>
                      {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(product)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu> */}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description || 'No description available'}
                    </p>

                    {/* Features */}
                    {features.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {features
                          .slice(0, 3)
                          .map((feature: StripeProduct, index: number) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {feature?.trim()}
                            </Badge>
                          ))}
                        {features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium capitalize">
                          {product.type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Live Mode:
                        </span>
                        <Badge
                          variant={product.livemode ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {product.livemode ? 'Live' : 'Test'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span className="font-medium">
                          {formatDate(product.created)}
                        </span>
                      </div>
                      {product.updated !== product.created && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Updated:
                          </span>
                          <span className="font-medium">
                            {formatDate(product.updated)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => handleViewDetails(product)}
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

      {/* Product Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Detailed information about this Stripe product
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Product ID
                    </Label>
                    <p className="font-mono text-sm break-all">
                      {selectedProduct.id}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Name
                    </Label>
                    <p className="font-medium">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Type
                    </Label>
                    <p className="font-medium capitalize">
                      {selectedProduct.type}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Status
                    </Label>
                    <Badge
                      variant={selectedProduct.active ? 'default' : 'secondary'}
                    >
                      {selectedProduct.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Live Mode
                    </Label>
                    <Badge
                      variant={
                        selectedProduct.livemode ? 'default' : 'secondary'
                      }
                    >
                      {selectedProduct.livemode ? 'Live' : 'Test'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Default Price
                    </Label>
                    <p className="font-medium">
                      {selectedProduct.default_price || 'Not set'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Description
                </h3>
                <p className="text-sm bg-muted p-3 rounded-md">
                  {selectedProduct.description || 'No description available'}
                </p>
              </div>

              {/* Product Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Shippable
                    </Label>
                    <p className="font-medium">
                      {selectedProduct.shippable ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Unit Label
                    </Label>
                    <p className="font-medium">
                      {selectedProduct.unit_label || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Statement Descriptor
                    </Label>
                    <p className="font-medium">
                      {selectedProduct.statement_descriptor || 'Not set'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Tax Code
                    </Label>
                    <p className="font-medium">
                      {selectedProduct.tax_code || 'Not set'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Metadata & Features */}
              {Object.keys(selectedProduct.metadata).length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Metadata & Features
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(selectedProduct.metadata).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <Label className="text-sm text-muted-foreground capitalize">
                            {key}:
                          </Label>
                          <p className="font-medium text-sm">
                            {key === 'features'
                              ? parseFeatures(selectedProduct.metadata).join(
                                  ', ',
                                )
                              : String(value)}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Images */}
              {selectedProduct.images.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Product Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedProduct.images.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-muted rounded-md overflow-hidden"
                      >
                        <img
                          src={image || '/placeholder.svg'}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Marketing Features */}
              {selectedProduct.marketing_features.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Marketing Features</h3>
                  <div className="space-y-2">
                    {selectedProduct.marketing_features.map(
                      (feature, index) => (
                        <div key={index} className="p-3 bg-muted rounded-md">
                          <p className="text-sm">{JSON.stringify(feature)}</p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timestamps
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Created
                    </Label>
                    <p className="font-medium">
                      {formatDate(selectedProduct.created)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Last Updated
                    </Label>
                    <p className="font-medium">
                      {formatDate(selectedProduct.updated)}
                    </p>
                  </div>
                </div>
              </div>

              {/* URL */}
              {selectedProduct.url && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Product URL</h3>
                  <a
                    href={selectedProduct.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {selectedProduct.url}
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Product Dialog Placeholder */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogDescription>
              Create a new product in Stripe
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 text-center text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4" />
            <p>Product creation form would go here</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StripeProductsList;
