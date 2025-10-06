import { Eye, Ban, RotateCcw, CreditCard, MoreHorizontal } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const UserInfoCard = ({ user, onAction }: any) => {
  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      suspended: 'secondary',
      banned: 'destructive',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    );
  };

  const getSubscriptionBadge = (subscription: string) => {
    return (
      <Badge variant={subscription === 'paid' ? 'default' : 'outline'}>
        {subscription}
      </Badge>
    );
  };

  return (
    <Card className="space-y-3 p-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction(user, 'suspend')}>
              <Ban className="h-4 w-4 mr-2" />
              {user.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction(user, 'reset')}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Password222
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction(user, 'subscription')}>
              <CreditCard className="h-4 w-4 mr-2" />
              Manage Subscription
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="text-sm space-y-1">
        <div>Status: {getStatusBadge(user.status)}</div>
        <div>Subscription: {getSubscriptionBadge(user.subscription)}</div>
        <div>Signup: {user.signupDate}</div>
        <div>Last Active: {user.lastActivity}</div>
        <div>Ratings: {user.ratings}</div>
        <div>Notes: {user.notes}</div>
        <div>Favorites: {user.favorites}</div>
      </div>
    </Card>
  );
};

export default UserInfoCard;
