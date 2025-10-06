import { useState } from 'react';
import {
  Search,
  MoreHorizontal,
  Eye,
  Ban,
  RotateCcw,
  CreditCard,
  LogOut,
  NotebookTabs,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import UserActionModals from './user-action-modals';
import {
  useGetAllUserQuery,
  useGetUsersAnalyticsQuery,
} from '../../redux/features/admin/adminManagementApi';
import { useDebounce } from '../../function/useDebounce';
interface User {
  id: string;
  name: string;
  email: string;
  subscriptionPlan: 'free' | 'paid';
  createdAt: string;
  lastActivity: string;
  isSuspend: boolean;
  ratings: number;
  notes: number;
  favorites: number;
  isIpBan: boolean;
}

type TActionType =
  | 'ban'
  | 'unban'
  | 'notes'
  | 'view'
  | 'suspend'
  | 'reset'
  | 'subscription'
  | 'Unsuspend'
  | 'force-logout'
  | null;

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('free');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<TActionType>(null);
  const {
    data: allUsersData,
    isFetching: isFetchingUsers,
    error: usersError,
  } = useGetAllUserQuery([
    { name: 'search', value: debouncedSearchTerm },
    { name: 'subscriptionPlan', value: subscriptionFilter },
    { name: 'isSuspend', value: statusFilter },
    { name: 'limit', value: '10' },
    { name: 'offset', value: '0' },
  ]);

  // Call second query
  const {
    data: analyticsData,
    isFetching: isFetchingUserAnalytics,
    error: analyticsError,
  } = useGetUsersAnalyticsQuery(undefined);

  // if (isFetchingUsers || isFetchingAnalytics) {
  //   return <div>Loading...</div>;
  // }

  if (usersError || analyticsError) {
    return <div>Error loading data.</div>;
  }

  const users = allUsersData?.data;
  const analytics = analyticsData?.data;

  const handleAction = (user: User, action: TActionType) => {
    setSelectedUser(user);
    if (!user.id) {
      window.alert('User Select');
    }
    if (action === 'suspend' && user.id) {
      console.log(user.id);
      // const {data,isFetching,isError} = useUserSuspendQuery({id:user.id})
      // console.log(data,isError)
    }

    setActionType(action);
  };

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge variant={status ? 'secondary' : 'default'}>
        {status ? 'Suspended' : 'Active'}
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
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-400">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="md:text-2xl font-bold">{analytics?.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-400">
              Paid Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="md:text-2xl font-bold">{analytics?.paidUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-400">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="md:text-2xl font-bold">
              {analytics?.activeUsers}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-yellow-400 font-medium">
              Suspended
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="md:text-2xl font-bold">
              {analytics?.suspendedUsers}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={subscriptionFilter}
              onValueChange={setSubscriptionFilter}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Subscription" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subscriptions</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Signup Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetchingUsers || isFetchingUserAnalytics ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user: User) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getSubscriptionBadge(user.subscriptionPlan)}
                      </TableCell>
                      <TableCell>{getStatusBadge(user.isSuspend)}</TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toDateString()}
                      </TableCell>
                      <TableCell className="text-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleAction(user, 'view')}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction(user, 'notes')}
                            >
                              <NotebookTabs className="h-4 w-4 mr-2" />
                              Set Notes
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleAction(
                                  user,
                                  user.isIpBan ? 'unban' : 'ban',
                                )
                              }
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              {user.isIpBan === true ? 'Unban' : 'Ban'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleAction(
                                  user,
                                  user.isSuspend ? 'Unsuspend' : 'suspend',
                                )
                              }
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              {user.isSuspend === true
                                ? 'Unsuspend'
                                : 'Suspend'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction(user, 'reset')}
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction(user, 'force-logout')}
                            >
                              <LogOut className="h-4 w-4 mr-2" />
                              Force Logout
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction(user, 'subscription')}
                            >
                              <CreditCard className="h-4 w-4 mr-2" />
                              Manage Subscription
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <UserActionModals
        user={selectedUser}
        actionType={actionType}
        setActionType={setActionType}
        onClose={() => {
          setSelectedUser(null);
          setActionType(null);
        }}
      />
    </div>
  );
};

export default UserManagement;
