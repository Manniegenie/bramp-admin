import { Card } from '@/components/ui/card';
import { Users, UserCheck, Shield, Clock } from 'lucide-react';
import type { UserStats } from '../hooks/useUserManagement';

interface UserStatsCardsProps {
  stats: UserStats | null;
}

export function UserStatsCards({ stats }: UserStatsCardsProps) {
  if (!stats) return null;

  const cards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Users',
      value: `${stats.percentageActive}%`,
      subValue: stats.activeUsers.toLocaleString(),
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Recent Users (24h)',
      value: stats.recentUsers.toLocaleString(),
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'KYC Breakdown',
      value: Object.entries(stats.kycBreakdown)
        .map(([level, count]) => `${level.replace('level', 'L')}: ${count}`)
        .join(' | '),
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-center gap-4">
            <div className={`${card.bgColor} p-3 rounded-lg`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold">{card.value}</h3>
              {card.subValue && (
                <p className="text-sm text-gray-500">{card.subValue} users</p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
