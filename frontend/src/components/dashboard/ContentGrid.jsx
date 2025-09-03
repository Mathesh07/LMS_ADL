import ContentCard from './ContentCard';
import { contents } from './data';

export default function ContentGrid() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
      {contents.map((c) => (
        <ContentCard key={c.id} item={c} />
      ))}
    </div>
  );
}


