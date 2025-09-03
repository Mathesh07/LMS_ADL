import { sidebar } from './data';
import { cn } from '@/lib/utils';
import {
  Clock, Share2, Archive, Files, Star, Folder, Settings, HelpCircle, UserRound
} from 'lucide-react';

const iconMap = { Clock, Share2, Archive, Files };

export default function LeftSidebar() {
  return (
    <aside className="hidden md:flex w-64 shrink-0 h-[calc(100vh-32px)] sticky top-4 flex-col rounded-2xl border bg-card/50 backdrop-blur p-3 gap-2">
      <Section title="Learning Content" items={sidebar.recents} />

      <div className="px-2">
        <div className="text-xs font-medium text-muted-foreground mb-2">Favorites</div>
        <div className="space-y-1">
          {sidebar.favorites.map((f) => (
            <Row key={f.label} icon={<Star className="size-4" />} label={f.label} />
          ))}
        </div>
      </div>

      <div className="px-2 mt-2">
        <div className="text-xs font-medium text-muted-foreground mb-2">Projects</div>
        <div className="space-y-1">
          {sidebar.projects.map((p) => (
            <Row key={p.label} icon={<Folder className="size-4 text-pink-600 dark:text-pink-400" />} label={p.label} active={p.label.toLowerCase().includes('fikri')} />
          ))}
        </div>
      </div>

      <div className="mt-auto pt-2 space-y-1 px-2">
        <Row icon={<Settings className="size-4" />} label="Settings" />
        <Row icon={<UserRound className="size-4" />} label="Profile" />
        <Row icon={<HelpCircle className="size-4" />} label="Help" />
      </div>
    </aside>
  );
}

function Section({ title, items }) {
  return (
    <div className="px-2">
      <div className="text-xs font-medium text-muted-foreground mb-2">{title}</div>
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = iconMap[item.icon] || Clock;
          return <Row key={item.label} icon={<Icon className="size-4" />} label={item.label} />;
        })}
      </nav>
    </div>
  );
}

function Row({ icon, label, active }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm cursor-pointer transition-colors',
        active ? 'bg-primary/10 text-foreground' : 'hover:bg-accent'
      )}
    >
      <span className="text-muted-foreground">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}


