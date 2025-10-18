import { createContext } from 'react'

export const DashboardTitleContext = createContext<
  { setTitle: (title: string) => void; setBreadcrumb: (crumbs: string[]) => void } | undefined
>(undefined)

// export default DashboardTitleContext
