import { MoreHorizontal, Users } from 'lucide-react';

export default function ContentCard({ item }) {
  return (
    <div className="rounded-2xl border bg-card hover:bg-accent/30 transition-colors shadow-sm p-3">
      <div className="relative h-36 rounded-xl overflow-hidden bg-muted">
        <img src={item.thumbnail} alt="thumb" className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 text-[11px] font-medium px-2 py-0.5 rounded-full bg-foreground/90 text-background">
          {item.assigned} Assigned
        </div>
        <button className="absolute top-2 right-2 rounded-full p-1.5 bg-background/90">
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      <div className="px-1 pt-3">
        <div className="text-sm font-semibold leading-snug line-clamp-2 mb-1">{item.title}</div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.tags.map((tag) => (
            <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{tag}</span>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Edited {item.editedAgo}</span>
            <span>•</span>
            <span>Completed</span>
            <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${item.completedPct}%` }} />
            </div>
            <span>{item.completedPct}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="size-4" />
          </div>
        </div>
      </div>
    </div>
  );
}


