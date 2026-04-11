import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardTitleContext } from '@/layouts/DashboardTitleContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '../components/UserTable';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { searchUsers } from '../store/userStore';
import type { RootState } from '@/core/store/store';
import type { AppDispatch } from '@/core/store/store';

type SortValue = 
  | "createdAt-desc" | "createdAt-asc"
  | "email-desc" | "email-asc"
  | "kycLevel-desc" | "kycLevel-asc"
  | "firstname-desc" | "firstname-asc"
  | "lastname-desc" | "lastname-asc";

export function UserManagement() {
  const titleCtx = useContext(DashboardTitleContext);
  const dispatch = useDispatch<AppDispatch>();
  
  const { users, loading, pagination } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    titleCtx?.setTitle('User Management');
    dispatch(searchUsers({})); // Initial load
  }, [titleCtx, dispatch]);

  const handleSearch = (value: string) => {
    dispatch(searchUsers({ q: value }));
  };

  const handleSort = (value: SortValue) => {
    const [field, order] = value.split('-') as [
      'email' | 'createdAt' | 'kycLevel' | 'firstname' | 'lastname',
      'asc' | 'desc'
    ];
    dispatch(searchUsers({ sortBy: field, sortOrder: order }));
  };

  const handlePageChange = (page: number) => {
    dispatch(searchUsers({ page }));
  };

  return (
    <div className="space-y-6">
      {/* Main Content */}
      <Card className="p-6">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="kyc0">KYC 0</TabsTrigger>
              <TabsTrigger value="kyc1">KYC 1</TabsTrigger>
              <TabsTrigger value="kyc2">KYC 2</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  className="pl-10"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <Select onValueChange={handleSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="email-asc">Email A-Z</SelectItem>
                  <SelectItem value="email-desc">Email Z-A</SelectItem>
                  <SelectItem value="kycLevel-desc">KYC Level (High-Low)</SelectItem>
                  <SelectItem value="kycLevel-asc">KYC Level (Low-High)</SelectItem>
                  <SelectItem value="firstname-asc">First Name A-Z</SelectItem>
                  <SelectItem value="firstname-desc">First Name Z-A</SelectItem>
                  <SelectItem value="lastname-asc">Last Name A-Z</SelectItem>
                  <SelectItem value="lastname-desc">Last Name Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <DataTable
              data={users}
              loading={loading}
              pagination={{
                currentPage: pagination?.skip ? Math.floor(pagination.skip / pagination.limit) + 1 : 1,
                totalPages: pagination?.total ? Math.ceil(pagination.total / (pagination?.limit || 10)) : 1,
                hasNextPage: pagination?.hasMore || false,
                hasPrevPage: pagination?.skip ? pagination.skip > 0 : false
              }}
              onPageChange={handlePageChange}
            />
          </TabsContent>

          <TabsContent value="active" className="mt-0">
            <DataTable
              data={users.filter(user => user.emailVerified)}
              loading={loading}
              pagination={{
                currentPage: pagination?.skip ? Math.floor(pagination.skip / pagination.limit) + 1 : 1,
                totalPages: pagination?.total ? Math.ceil(pagination.total / (pagination?.limit || 10)) : 1,
                hasNextPage: pagination?.hasMore || false,
                hasPrevPage: pagination?.skip ? pagination.skip > 0 : false
              }}
              onPageChange={handlePageChange}
            />
          </TabsContent>

          {[0, 1, 2].map(level => (
            <TabsContent key={level} value={`kyc${level}`} className="mt-0">
              <DataTable
                data={users.filter(user => user.kycLevel === level)}
                loading={loading}
                pagination={{
                  currentPage: pagination?.skip ? Math.floor(pagination.skip / pagination.limit) + 1 : 1,
                  totalPages: pagination?.total ? Math.ceil(pagination.total / (pagination?.limit || 10)) : 1,
                  hasNextPage: pagination?.hasMore || false,
                  hasPrevPage: pagination?.skip ? pagination.skip > 0 : false
                }}
                onPageChange={handlePageChange}
              />
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}