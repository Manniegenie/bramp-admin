import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { TokenStat } from '../type/analytic'

interface Props {
  data: TokenStat[]
}

export const TokenStatsChart: React.FC<Props> = ({ data }) => {
  // transform token stats to chart data where x is _id
  const chartData = data.map((t) => ({
    token: t._id,
    buyCount: t.buyCount,
    sellCount: t.sellCount,
    tradeCount: t.tradeCount,
    totalVolume: t.totalVolume,
  }))

  return (
    <div className="w-full h-75">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="token" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="buyCount" stroke="#10B981" dot={true} />
          <Line type="monotone" dataKey="sellCount" stroke="#3B82F6" dot={true} />
          <Line type="monotone" dataKey="tradeCount" stroke="#F59E0B" dot={true} />
          <Line type="monotone" dataKey="totalVolume" stroke="#000000" dot={true} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TokenStatsChart
