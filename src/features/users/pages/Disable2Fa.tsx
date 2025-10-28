import { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardTitleContext } from '@/layouts/DashboardTitleContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { disableTwoFa } from '@/features/users/services/twoFaService';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export function Disable2Fa() {
  const titleCtx = useContext(DashboardTitleContext);

  const location = useLocation();
    const navigate = useNavigate();
    const stateUser = (location.state as any)?.user;
    const [emailValue, setEmailValue] = useState(stateUser?.email || '');
  const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
      titleCtx?.setTitle('Disable 2fa');
      titleCtx?.setBreadcrumb([
        'User Management',
        'User Account',
        'Disable 2fa',
      ]);
    }, [titleCtx]);

  const handleDisable = async () => {
    try {
      const email = emailValue.trim();
      if (!email) {
        toast.error('Please provide an email');
        return;
      }
      const resp = await disableTwoFa(email);
      if (resp && resp.success) {
        toast.success(resp.message || '2FA disabled');
        setConfirmOpen(false);
        // navigate back to user list or user details
        navigate(-1);
      } else {
        toast.error(resp.message || 'Failed to disable 2FA');
      }
    } catch (err) {
      console.error('Disable 2FA failed', err);
      toast.error('Disable 2FA failed');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 space-y-6">
      <Card className='border border-gray-200 shadow-none'>
        <CardContent className="py-12 px-6">
          <div className="w-full flex flex-col justify-center items-start gap-8">
            <div className="flex flex-col gap-2 items-start justify-center w-full">
                <Label className="w-full text-gray-800" htmlFor="email">User Email</Label>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full h-12 border border-gray-200 shadow-none"
          required
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
        />
            </div>

            <Button onClick={() => setConfirmOpen(true)} className="flex h-12 w-full text-white items-center gap-2">
              <Lock className="h-4 w-4" />
              Disable 2fa
            </Button>
          </div>
        </CardContent>
      </Card>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className='bg-white text-black/90 border border-gray-200 shadow-lg max-w-md'>
          <DialogHeader>
            <DialogTitle>Confirm Disable 2FA</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to disable two-factor authentication for <strong>{emailValue}</strong>? This action can reduce account security.
          </div>
          <DialogFooter>
            <Button variant="secondary" className='border border-red-500 text-red-500' onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleDisable} className='bg-red-500 text-white'>Disable 2FA</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
