import React from 'react';
import { Sparkles, TrendingUp, Users, Cake, Star, Award, Calendar, LogOut } from 'lucide-react';

type CardType = 'newHire' | 'promotion' | 'transfer' | 'birthday' | 'anniversary' | 'event' | 'bestEmployee' | 'bestPerformer' | 'exit';

const cardTypeIcons = {
  newHire: Users,
  promotion: TrendingUp,
  transfer: Award,
  birthday: Cake,
  anniversary: Sparkles,
  event: Calendar,
  bestEmployee: Star,
  bestPerformer: Award,
  exit: LogOut,
};

const cardTypeLabels: Record<CardType, string> = {
  newHire: 'New Hire',
  promotion: 'Promoted',
  transfer: 'Transferred',
  birthday: 'Birthday',
  anniversary: 'Anniversary',
  event: 'Event',
  bestEmployee: 'Employee of the Month',
  bestPerformer: 'Best Performer',
  exit: 'Exit',
};

const typeColors: Record<CardType, { bg: string; accent: string }> = {
  newHire: { bg: '#F7EED7', accent: '#52275A' },
  promotion: { bg: '#E7DBEE', accent: '#6E3371' },
  transfer: { bg: '#C2A2CB', accent: '#8E4A90' },
  birthday: { bg: '#FFEAA7', accent: '#FFD058' },
  anniversary: { bg: '#E7DBEE', accent: '#52275A' },
  event: { bg: '#FFD058', accent: '#52275A' },
  bestEmployee: { bg: '#FFC700', accent: '#6E3371' },
  bestPerformer: { bg: '#F9BC1C', accent: '#52275A' },
  exit: { bg: '#FFEAA7', accent: '#52275A' },
};

interface RecentPostCardProps {
  type: CardType;
  title: string;
  subtitle?: string;
  caption?: string;
  date: string;
  badge?: string;
  avatarText?: string;
  onClick?: () => void;
}

export const RecentPostCard: React.FC<RecentPostCardProps> = ({ type, title, subtitle, caption, date, badge, avatarText, onClick }) => {
  const Icon = cardTypeIcons[type];
  const { bg, accent } = typeColors[type];
  return (
    <div
      style={{ ['--bg' as any]: bg, ['--accent' as any]: accent }}
      className={`rounded-2xl shadow-xl border-2 p-5 flex items-start gap-5 hover:scale-[1.02] transition cursor-pointer mb-4 bg-[var(--bg)] border-[var(--accent)]`}
      tabIndex={0}
      onClick={onClick}
    >
      <div className={`rounded-full w-14 h-14 flex items-center justify-center text-white font-extrabold text-2xl shrink-0 select-none bg-[var(--accent)]`}>
        {avatarText ? avatarText.charAt(0).toUpperCase() : <Icon size={28} />}
      </div>
      <div className="flex-1">
        <div className="flex gap-2 items-center mb-1">
          <span className="text-base font-semibold text-[var(--accent)]">{title}</span>
          {badge && <span className="ml-2 bg-white text-xs px-3 py-1 rounded-full font-bold shadow-sm text-[var(--accent)]">{badge}</span>}
        </div>
        {subtitle && <div className="text-sm text-gray-700 mb-1">{subtitle}</div>}
        {caption && <div className="text-xs text-gray-500 italic mb-1">{caption}</div>}
        <div className="flex gap-2 items-center mt-1">
          <span className="text-xs font-bold text-[var(--accent)]">{cardTypeLabels[type]}</span>
          <span className="text-xs text-gray-400">· {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit'})}</span>
        </div>
      </div>
    </div>
  );
};





