import { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/core/store/store';
import { fetchRefreshTokens } from '../store/securitySlice';
import { DataTable } from '../components/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { DashboardTitleContext } from '@/layouts/DashboardTitleContext';

type TokenRow = { token: string; createdAt: string };

export function Security() {
  const dispatch = useDispatch<AppDispatch>();
  
    const titleCtx = useContext(DashboardTitleContext);
  
    useEffect(() => {
      titleCtx?.setTitle("Refresh Token");
      titleCtx?.setBreadcrumb([
        "Security",
        "Refresh tokens",
      ]);
    }, [titleCtx]);

  // Fetch refresh tokens
  const [emailInput, setEmailInput] = useState<string>('');
  const [fetching, setFetching] = useState(false);
  const [fetchedTokens, setFetchedTokens] = useState<TokenRow[]>([]);

  async function handleFetchTokens() {
    if (!emailInput) return toast.error('Provide an email');
    const token = localStorage.getItem('token');
    if (!token) return toast.error('Moderator token not found in localStorage. Please login or provide a moderator token.');
    setFetching(true);
    try {
      const res = await dispatch(fetchRefreshTokens({ email: emailInput, token })).unwrap();
      // res shape: { email, refreshTokens }
      setFetchedTokens(res.refreshTokens ?? []);
      toast.success('Fetched refresh tokens');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg || 'Failed to fetch refresh tokens');
    } finally {
      setFetching(false);
    }
  }

  return (
    <div className="w-full px-6 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="border border-gray-200 py-8">
          <CardHeader>
            <CardTitle>Get Refresh Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <Label htmlFor="email" className='text-gray-400'>User email</Label>
                <Input id="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="Enter user email" className="mt-2 h-10 border-gray-300" />
              </div>
              <div className="flex gap-2">
                <Button className="w-full h-10 bg-primary text-white" onClick={handleFetchTokens} disabled={fetching}>{fetching ? 'Fetching…' : 'Fetch refresh tokens'}</Button>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* show fetched tokens in table */}
      <div className="max-w-4/5 mx-auto mt-6">
        {/* typed columns for tokens */}
        <DataTable
          columns={([
            {
              accessorKey: 'token',
              header: 'Token',
            },
            {
              accessorKey: 'createdAt',
              header: 'Created At',
              cell: ({ row }: { row: { original: TokenRow } }) => new Date(row.original.createdAt).toLocaleString(),
            },
          ] as ColumnDef<TokenRow, unknown>[])}
          data={fetchedTokens}
        />
      </div>
    </div>
  );
}