import axios from '@/core/services/axios'

export interface RegisterAdminPayload {
  adminName: string
  email: string
  passwordPin: string
  role?: 'admin' | 'super_admin' | 'moderator'
}

export const registerAdmin = async (payload: RegisterAdminPayload) => {
    const token = localStorage.getItem('token')
    const BASE_URL = import.meta.env.VITE_BASE_URL
    const res = await axios.post(`${BASE_URL}/admin/register`, payload, {
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : undefined },
    })
    return res.data
}

export default registerAdmin
