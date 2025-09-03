import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const modules = [
  { id: 'm1', title: 'Intro to React', desc: 'Components, state, props', progress: 42 },
  { id: 'm2', title: 'TypeScript Basics', desc: 'Types, interfaces, generics', progress: 10 },
  { id: 'm3', title: 'Node & Express', desc: 'APIs and middleware', progress: 70 },
  { id: 'm4', title: 'SQL Fundamentals', desc: 'Joins and queries', progress: 0 },
];

const notes = [
  { id: 'n1', title: 'Hooks summary', context: 'React' },
  { id: 'n2', title: 'TS Utility types', context: 'TypeScript' },
  { id: 'n3', title: 'REST vs RPC', context: 'Backend' },
];

const groups = [
  { id: 'g1', name: 'Frontend Circle', members: 12 },
  { id: 'g2', name: 'DSA Weekly', members: 8 },
];

function DashboardHome() {
  const progressData = useMemo(() => (
    [
      { day: 'Mon', progress: 20 },
      { day: 'Tue', progress: 35 },
      { day: 'Wed', progress: 50 },
      { day: 'Thu', progress: 65 },
      { day: 'Fri', progress: 70 },
      { day: 'Sat', progress: 80 },
      { day: 'Sun', progress: 85 },
    ]
  ), []);

  const usageHeat = useMemo(() => {
    // Mock usage frequency for current month: day -> count
    return { 2: 1, 3: 2, 5: 3, 8: 1, 12: 2, 17: 3, 22: 1, 27: 2 };
  }, []);

  const { monthDates, low, mid, high } = useMemo(() => {
    const now = new Date();
    const base = new Date(now.getFullYear(), now.getMonth(), 1);
    const low = []; const mid = []; const high = [];
    Object.entries(usageHeat).forEach(([d, c]) => {
      const date = new Date(base.getFullYear(), base.getMonth(), Number(d));
      if (c >= 3) high.push(date); else if (c === 2) mid.push(date); else low.push(date);
    });
    return { monthDates: base, low, mid, high };
  }, [usageHeat]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Stay focused. Progress follows.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 bg-secondary/60 rounded-xl p-4">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
            <CardDescription>Your learning momentum</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              className="aspect-[16/7]"
              config={{
                progress: {
                  label: 'Progress',
                  theme: {
                    light: 'hsl(var(--primary))',
                    dark: 'hsl(var(--primary))',
                  },
                },
              }}>
              <LineChart data={progressData} margin={{ left: 12, right: 12, top: 6 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis hide domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                <Line type="monotone" dataKey="progress" stroke="var(--color-progress)" strokeWidth={2} dot={false} />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Calendar</CardTitle>
            <CardDescription>Days you visited the portal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border p-2">
              <Calendar
                showOutsideDays={false}
                modifiers={{ low, mid, high }}
                modifiersClassNames={{
                  low: 'bg-primary/10 text-foreground',
                  mid: 'bg-primary/20 text-foreground',
                  high: 'bg-primary/30 text-foreground',
                }}
                captionLayout="label"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Learning Path</CardTitle>
            <CardDescription>Your current modules at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {modules.slice(0,3).map(m => (
              <div key={m.id} className="flex items-center justify-between transition-colors rounded-md p-2 hover:bg-accent cursor-pointer">
                <div>
                  <div className="text-sm font-medium">{m.title}</div>
                  <div className="text-xs text-muted-foreground">{m.desc}</div>
                </div>
                <Badge variant="outline" className="transition-colors">{m.progress}%</Badge>
              </div>
            ))}
            <div className="pt-2">
              <Button variant="outline" size="sm" className="cursor-pointer transition-transform hover:-translate-y-0.5">View path</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Featured Modules</CardTitle>
            <CardDescription>Compact picks to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {modules.map(m => (
                <div key={m.id} className="border rounded-lg p-3 transition-shadow hover:shadow-md">
                  <div className="text-sm font-medium mb-1">{m.title}</div>
                  <div className="text-xs text-muted-foreground mb-3">{m.desc}</div>
                  <Button size="sm" className="w-full cursor-pointer transition-all hover:opacity-90">Start</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Recent snippets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notes.map(n => (
              <div key={n.id} className="flex items-center justify-between p-2 rounded-md transition-colors hover:bg-accent cursor-pointer">
                <div className="text-sm">{n.title}</div>
                <Badge variant="outline" className="text-xs">{n.context}</Badge>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="cursor-pointer transition-transform hover:-translate-y-0.5">New note</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Study Groups</CardTitle>
            <CardDescription>Quick entries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {groups.map(g => (
              <div key={g.id} className="flex items-center justify-between p-2 rounded-md transition-colors hover:bg-accent cursor-pointer">
                <div className="text-sm font-medium">{g.name}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{g.members}</span>
                  <Button size="sm" variant="outline" className="cursor-pointer hover:bg-primary/10">Open</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Small nudges</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="hover:shadow-sm cursor-default">Complete 3 modules today</Badge>
            <Badge variant="secondary" className="hover:shadow-sm cursor-default">2 notes waiting</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


export default DashboardHome