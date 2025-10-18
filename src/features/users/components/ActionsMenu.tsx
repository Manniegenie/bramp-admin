"use client"
import React from "react";
import type { Row } from "@tanstack/react-table";
import type { User } from "../types/user";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/core/store/store';
import { removeUser, fetchUsers } from '../store/usersSlice';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { statusByPhone } from '@/features/users/services/usersService';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

export function ActionsMenu({ row }: { row: Row<User> }) {
  const [open, setOpen] = React.useState(false);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const [pos, setPos] = React.useState<{ left: number; top: number } | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const navigate = useNavigate();
  const [statusOpen, setStatusOpen] = React.useState(false);
  const [statusResult, setStatusResult] = React.useState<unknown | null>(null);
  const [statusLoading, setStatusLoading] = React.useState(false);


  const onConfirmDelete = async () => {
    await dispatch(removeUser(row.original.email));
    await dispatch(fetchUsers());
    setConfirmOpen(false);
  };

  React.useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!btnRef.current) return;
      const target = e.target as Node;
      if (btnRef.current.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);

  const toggle = () => {
    if (!btnRef.current) {
      setOpen((v) => !v);
      return;
    }
    const rect = btnRef.current.getBoundingClientRect();
    setPos({ left: rect.right - 176, top: rect.bottom + window.scrollY + 6 });
    setOpen((v) => !v);
  };

  return (
    <div>
      <Button
        ref={btnRef}
        variant="ghost"
        className="p-2 rounded hover:bg-gray-100"
        onClick={toggle}
        aria-label="More actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {open && pos && createPortal(
        <div style={{ position: 'absolute', left: pos.left, top: pos.top }} className="z-60">
          <div className="w-44 bg-white text-black/90 border border-gray-200 rounded shadow-lg">
            <Link
              to="/user-management/summary"
              state={{ user: row.original }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Summary
            </Link>
            <Link
              to="/user-management/disable-2fa"
              state={{ user: row.original }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Disable 2fa
            </Link>
            <Link
              to="/user-management/remove-password"
              state={{ user: row.original }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Remove Password
            </Link>
            <Link
              to="/user-management/fetch-wallets"
              state={{ user: row.original }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Wallet
            </Link>
            <Link
              to="/user-management/wipe-pending-balance"
              state={{ user: row.original }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Wipe pending balance
            </Link>
              <Button
              variant={"ghost"}
                onClick={() => navigate('/user-management/generate-wallet-by-phone', { state: { user: row.original } })}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 font-normal"
              >
                Generate wallets
              </Button>
              <Button
              variant={"ghost"}
                onClick={() => navigate('/user-management/regenerate-wallet-by-phone', { state: { user: row.original } })}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 font-normal"
              >
                Regenerate wallet
              </Button>
              <Button variant={"ghost"}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 font-normal"
              onClick={async () => {
                const phone = row.original.phonenumber || '';
                if (!phone) {
                  toast.error('User has no phone number');
                  return;
                }
                try {
                  const res = await statusByPhone(phone);
                  setStatusResult(res);
                  setStatusOpen(true);
                } catch (err) {
                  console.error('status fetch error', err);
                  toast.error('Failed to fetch wallet generation status');
                }
              }}
              >
                Wallet generation status
              </Button>
            <Button
            variant={"ghost"}
              onClick={() => setConfirmOpen(true)}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
            >
              Delete
            </Button>
          </div>
        </div>,
        document.body
      )}

      {/* Generate/Regenerate actions navigate to dedicated pages (prefilled via router state) */}
      <Dialog open={statusOpen} onOpenChange={(v) => { if (!v) setStatusResult(null); setStatusOpen(v); }}>
        <DialogContent className="bg-white border border-gray-200 shadow-lg max-w-md text-black/90">
          <DialogHeader className="pb-4 border-b border-gray-200">
            <DialogTitle>Wallet generation status</DialogTitle>
          </DialogHeader>
          {statusResult ? (
            (() => {
              type StatusResp = {
                success?: boolean;
                user?: { id?: string; email?: string; phonenumber?: string };
                walletGenerationStatus?: string;
                walletsGenerated?: number;
                totalWallets?: number;
                progress?: string;
                isComplete?: boolean;
                [key: string]: unknown;
              };
              const s = statusResult as StatusResp;
              const statusText = String(s.walletGenerationStatus ?? (s as Record<string, unknown>)['wallet_generation_status'] ?? s.status ?? 'unknown');
              const walletsGenerated = Number(s.walletsGenerated ?? s.wallets_generated ?? 0) || 0;
              const totalWallets = Number(s.totalWallets ?? s.total_wallets ?? 0) || 0;
              const pct = totalWallets ? Math.round((walletsGenerated / totalWallets) * 100) : 0;
              const isComplete = s.isComplete ?? s.is_complete ?? false;
              const badgeColor = isComplete ? 'bg-green-100 text-green-800' : (statusText === 'in_progress' || statusText === 'started' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800');

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">Success</div>
                    <div>{String(s.success ?? true)}</div>

                    <div className="text-gray-500">User ID</div>
                    <div>{s.user?.id ?? '—'}</div>

                    <div className="text-gray-500">Email</div>
                    <div>{s.user?.email ?? '—'}</div>

                    <div className="text-gray-500">Phone</div>
                    <div>{s.user?.phonenumber ?? '—'}</div>

                    <div className="text-gray-500">Status</div>
                    <div><span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${badgeColor}`}>{statusText}</span></div>

                    <div className="text-gray-500">Progress</div>
                    <div>{s.progress ?? `${walletsGenerated}/${totalWallets}`}</div>

                    <div className="text-gray-500">Complete</div>
                    <div>{String(isComplete)}</div>
                  </div>

                  {totalWallets > 0 && (
                    <div>
                      <div className="text-sm mb-1">Progress: {walletsGenerated} / {totalWallets} ({pct}%)</div>
                      <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
                        <div className="h-2 bg-green-600" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )}

                </div>
              );
            })()
          ) : (
            <div className="text-sm text-gray-500">No status available</div>
          )}
          <DialogFooter>
            <div className="flex items-center gap-2">
              <Button disabled={statusLoading} className="text-white" onClick={async () => {
                const phone = row.original.phonenumber || '';
                if (!phone) {
                  toast.error('User has no phone number');
                  return;
                }
                try {
                  setStatusLoading(true);
                  const res = await statusByPhone(phone);
                  setStatusResult(res);
                } catch (err) {
                  console.error('refresh status error', err);
                  toast.error('Failed to refresh status');
                } finally {
                  setStatusLoading(false);
                }
              }}>{statusLoading ? 'Refreshing...' : 'Refresh'}</Button>
              <Button onClick={() => setStatusOpen(false)} className="bg-black/87 text-white">Close</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={confirmOpen} onOpenChange={(v) => setConfirmOpen(v)}>
        <DialogContent className="text-black/90 bg-white border border-gray-200 shadow-lg max-w-sm w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
          </DialogHeader>
          <div className="text-sm">Are you sure you want to delete <strong>{row.original.email}</strong>?</div>
          <DialogFooter>
            <Button variant="ghost" className="border border-gray-300 text-gray-300" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button className="ml-2 text-white bg-red-500" onClick={onConfirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
