import { Button } from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';

const tabs = ['Folder', 'Page', 'Course', 'Quiz', 'Assignment', 'Learning Path', 'Wiki'];

export default function TopNavbar() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 grid place-items-center rounded-md bg-primary text-primary-foreground text-xs font-bold">F</div>
          <div className="text-lg font-semibold">Fikri Studio</div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="size-4" /> Upload
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="size-4" /> New Content
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {tabs.map((t) => (
            <button key={t} className={`px-3 py-1.5 text-sm rounded-lg border ${t==='Learning Path' ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-accent'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">Date Created</div>
      </div>
    </div>
  );
}


