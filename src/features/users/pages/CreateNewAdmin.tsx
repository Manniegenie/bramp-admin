import { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardTitleContext } from '@/layouts/DashboardTitleContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// icon removed (not used)
import { registerAdmin } from '../services/adminService'
import { toast } from 'sonner'

type Role = 'admin' | 'super_admin' | 'moderator'

export function CreateNewAdmin() {
  const titleCtx = useContext(DashboardTitleContext);

    useEffect(() => {
      titleCtx?.setTitle('Create New Admin');
      titleCtx?.setBreadcrumb([
        'User Management',
        'User Account',
        'Create new admin',
      ]);
  }, [titleCtx]);

  const [adminName, setAdminName] = useState('')
  const [email, setEmail] = useState('')
  const [passwordPin, setPasswordPin] = useState('')
  const [role, setRole] = useState<Role>('admin')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    if (!adminName || adminName.length < 2 || adminName.length > 100) {
      toast.error('Admin name must be between 2 and 100 characters')
      return false
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      toast.error('Enter a valid email address')
      return false
    }
    if (!/^[0-9]{6}$/.test(passwordPin)) {
      toast.error('Password PIN must be exactly 6 digits')
      return false
    }
    if (!['admin', 'super_admin', 'moderator'].includes(role)) {
      toast.error('Invalid role')
      return false
    }
    return true
  }

  const handleRegister = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const payload = { adminName, email, passwordPin, role }
      const res = await registerAdmin(payload)
      toast.success(res?.message || 'Admin registered successfully')
      // clear form
      setAdminName('')
      setEmail('')
      setPasswordPin('')
      setRole('admin')
    } catch (err: unknown) {
      const anyErr = err as { response?: { status?: number; data?: { message?: string } } }
      if (anyErr?.response?.status === 409) {
        toast.error('An admin with this email already exists')
      } else if (anyErr?.response?.data?.message) {
        toast.error(anyErr.response.data.message)
      } else {
        toast.error('Failed to register admin')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 space-y-6">
      <Card className='border border-gray-200 shadow-none'>
        <CardContent className="py-12 px-6">
          <div className="w-full flex flex-col justify-center items-start gap-8">
            <form onSubmit={handleRegister} className="w-full space-y-4">
              <div className="flex flex-col gap-2 items-start justify-center w-full">
                  <Label className="w-full text-gray-800" htmlFor="adminName">Admin name</Label>
                  <Input
                      id="adminName"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      type="text"
                      name="adminName"
                      placeholder="Admin name"
                      className="w-full h-12 border border-gray-200 shadow-none"
                      required
                  />
              </div>

              <div className="flex flex-col gap-2 items-start justify-center w-full">
                  <Label className="w-full text-gray-800" htmlFor="email">Email</Label>
                  <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      name="email"
                      placeholder="Email"
                      className="w-full h-12 border border-gray-200 shadow-none"
                      required
                  />
              </div>

              <div className="flex flex-col gap-2 items-start justify-center w-full">
                  <Label className="w-full text-gray-800" htmlFor="passwordPin">Password PIN</Label>
                  <Input
                      id="passwordPin"
                      type="password"
                      value={passwordPin}
                      onChange={(e) => setPasswordPin(e.target.value)}
                      name="passwordPin"
                      placeholder="6 digit PIN"
                      className="w-full h-12 border border-gray-200 shadow-none"
                      required
                  />
              </div>

              <div className="flex flex-col gap-2 items-start justify-center w-full">
                  <Label className="w-full text-gray-800" htmlFor="role">Role</Label>
                  <select id="role" aria-label="Role" value={role} onChange={(e) => setRole(e.target.value as Role)} className="w-full h-12 border border-gray-200 rounded px-3 py-2 shadow-none">
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
              </div>

              <div>
                <Button type="submit" className="flex h-12 w-full text-white items-center gap-2" disabled={loading}>
                  {loading ? 'Registering...' : 'Register Admin'}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
