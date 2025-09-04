import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  Calendar,
  X
} from "lucide-react"
import { LearningContentCard, type LearningContent } from "@/components/LearningContentCard"
import { CreateContentModal } from "@/components/CreateContentModal"
import { NotificationDropdown } from "@/components/NotificationDropdown"

// Mock roadmap data
const mockRoadmaps: LearningContent[] = [
  {
    id: '1',
    title: 'Cybersecurity Fundamentals',
    description: 'Master essential cybersecurity concepts from network security to incident response.',
    type: 'course',
    category: 'Security',
    priority: 'Urgent',
    assignedCount: 6,
    progress: 65,
    lastEdited: '2h ago',
    status: 'in-progress'
  },
  {
    id: '2', 
    title: 'Full Stack Web Development',
    description: 'Complete roadmap covering frontend, backend, databases, and deployment.',
    type: 'path',
    category: 'Development',
    priority: 'Not Urgent',
    assignedCount: 12,
    progress: 30,
    lastEdited: '1d ago',
    status: 'in-progress'
  },
  {
    id: '3',
    title: 'Data Science & Machine Learning',
    description: 'Comprehensive path from statistics to advanced ML algorithms and deployment.',
    type: 'course',
    category: 'Data Science',
    priority: 'Urgent', 
    assignedCount: 8,
    progress: 85,
    lastEdited: '3h ago',
    status: 'in-progress'
  },
  {
    id: '4',
    title: 'UI/UX Design Mastery',
    description: 'Design thinking, user research, prototyping, and design systems.',
    type: 'assignment',
    category: 'Design',
    priority: 'Not Urgent',
    assignedCount: 4,
    progress: 45,
    lastEdited: '5h ago', 
    status: 'in-progress'
  },
  {
    id: '5',
    title: 'Cloud Architecture (AWS)',
    description: 'Learn cloud computing, serverless architecture, and AWS services.',
    type: 'page',
    category: 'Cloud',
    priority: 'Not Urgent',
    assignedCount: 3,
    progress: 15,
    lastEdited: '2d ago',
    status: 'in-progress'
  },
  {
    id: '6',
    title: 'DevOps Engineering',
    description: 'CI/CD, containerization, monitoring, and infrastructure as code.',
    type: 'quiz',
    category: 'DevOps',
    priority: 'Not Urgent',
    assignedCount: 7,
    progress: 100,
    lastEdited: '1w ago',
    status: 'completed'
  }
]

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("Prototyping, Not Urgent")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredContent = mockRoadmaps.filter(content =>
    content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-card-foreground">Fikri Studio</h1>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <span>RF</span>
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-current rounded-full" />
                  <div className="w-1 h-1 bg-current rounded-full" />
                  <div className="w-1 h-1 bg-current rounded-full" />
                </div>
                <span>+</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <NotificationDropdown />
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <Button 
              size="sm" 
              className="bg-gradient-primary hover:opacity-90 border-0"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Content
            </Button>
          </div>
        </div>
      </header>


      {/* Filters and Search */}
      <div className="px-6 py-4 bg-card border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              Category: {selectedFilter}
              <X className="w-3 h-3 ml-2 cursor-pointer" onClick={() => setSelectedFilter("")} />
            </Badge>
            <Button variant="ghost" size="sm" className="text-primary">
              Reset
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Add Filter
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Date Created
            </Button>
            
            <div className="flex items-center border border-border rounded-md">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="sm"
                className="rounded-r-none border-0"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                size="sm"
                className="rounded-l-none border-0"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {filteredContent.length} content
            </span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
        }>
          {filteredContent.map((content) => (
            <LearningContentCard key={content.id} content={content} />
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-card-foreground mb-2">No content found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      <CreateContentModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
      />
    </div>
  )
}