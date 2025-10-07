import { useState } from 'react';
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Medal,
  Award,
} from 'lucide-react';
import { format } from 'date-fns';
import { useAdminLeaderboardQuery } from '../../redux/features/admin/adminAnalytics';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Badge } from '../ui/badge';

export default function AdminLeaderboard() {
  const [filterType, setFilterType] = useState<'week' | 'month' | 'range'>(
    'month',
  );
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Build query args
  const queryArgs = {
    type: filterType,
    skip: currentPage,
    take: itemsPerPage,
    ...(filterType === 'range' && startDate && endDate
      ? {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
        }
      : {}),
  };

  const { data, isLoading, isError } = useAdminLeaderboardQuery(queryArgs);

  const handleFilterChange = (value: 'week' | 'month' | 'range') => {
    // * if value is range then set startDate and endDate first the set the filter type
    if (value === 'range') {
      setStartDate(new Date());
      setEndDate(new Date());
    }

    setFilterType(value);
    setCurrentPage(1);
    if (value !== 'range') {
      setStartDate(undefined);
      setEndDate(undefined);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return (
          <span className="text-muted-foreground font-semibold">{rank}</span>
        );
    }
  };

  const getRankBadgeVariant = (
    rank: number,
  ): 'default' | 'secondary' | 'outline' => {
    if (rank === 1) return 'default';
    if (rank === 2) return 'secondary';
    return 'outline';
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-balance">
          Admin Leaderboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Track top performers and user engagement metrics
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Customize your leaderboard view</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">
                Time Period
              </label>
              <Select value={filterType} onValueChange={handleFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="range">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filterType === 'range' && (
              <>
                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-medium mb-2 block">
                    Start Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-transparent"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="text-sm font-medium mb-2 block">
                    End Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-transparent"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}
          </div>

          {data && (
            <div className="mt-4 text-sm text-muted-foreground">
              Showing results from {format(new Date(data.from), 'PPP')} to{' '}
              {format(new Date(data.to), 'PPP')}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rankings</CardTitle>
          <CardDescription>
            {data?.pagination.totalUsers || 0} total users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {isError && (
            <div className="text-center py-12">
              <p className="text-destructive font-medium">
                Error loading leaderboard
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Please try again later
              </p>
            </div>
          )}

          {!isLoading && !isError && (!data || data.data.length === 0) && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No leaderboard data found</p>
            </div>
          )}

          {!isLoading && !isError && data && data.data.length > 0 && (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Rank</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead className="text-right">XP</TableHead>
                      <TableHead className="text-right">Shares</TableHead>
                      <TableHead className="text-right">Coffees</TableHead>
                      <TableHead className="text-right">Total Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((user: any) => (
                      <TableRow
                        key={user.userId}
                        className={user.rank <= 3 ? 'bg-muted/50' : ''}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRankIcon(user.rank)}
                            {user.rank <= 3 && (
                              <Badge
                                variant={getRankBadgeVariant(user.rank)}
                                className="ml-1"
                              >
                                #{user.rank}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {user.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {user.xp.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {user.shares.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {user.coffees.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary" className="font-mono">
                            {user.totalScore.toLocaleString()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Page {data.pagination.page} of {data.pagination.totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= data.pagination.totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
