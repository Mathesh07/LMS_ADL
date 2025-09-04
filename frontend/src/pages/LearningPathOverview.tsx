import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Users, 
  Globe,
  X,
  Plus,
  Sparkles
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const categoryOptions = [
  'Prototyping', 'UI/UX', 'Design', 'Card', 'Not Urgent', 'UX', 'Rounded', 
  'Initial', 'Wireframe', 'Component', 'Text Style', 'Color Style'
]

export default function LearningPathOverview() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: 'General Knowledge & Methodology - Layout & Spacing',
    categories: ['Prototyping', 'Not Urgent'],
    duration: '1 Weeks',
    trainer: '',
    language: 'English',
    description: 'Combining good layout design and spacing design in Figma will result in a more professional, structured, and aesthetic design, ensuring a better user experience when using a product or website.'
  })

  const handleCategoryAdd = (category: string) => {
    if (!formData.categories.includes(category)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, category]
      }))
    }
  }

  const handleCategoryRemove = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }))
  }

  const handleContinue = () => {
    navigate('/learning-path/add-content')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
            >
              <X className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-semibold">Create Learning Path</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Next: <span className="font-medium">Add Content</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-primary hover:opacity-90"
                onClick={handleContinue}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card border-b border-border px-6 py-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
              1
            </div>
            <span className="font-medium text-primary">Learning Path Overview</span>
          </div>
          <div className="flex-1 h-1 bg-muted rounded-full">
            <div className="h-full w-1/3 bg-gradient-primary rounded-full" />
          </div>
          <div className="text-sm text-muted-foreground">Step 1 of 3</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <Card className="overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative">
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-content-path rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </Card>

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-base font-medium">
                  Learning Path Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="text-lg font-medium mt-2"
                />
              </div>

              <div>
                <Label className="text-base font-medium">Category</Label>
                <div className="mt-2 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.categories.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                        onClick={() => handleCategoryRemove(category)}
                      >
                        {category}
                        <X className="w-3 h-3 ml-2" />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions
                      .filter(cat => !formData.categories.includes(cat))
                      .map((category) => (
                        <Badge
                          key={category}
                          variant="outline"
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => handleCategoryAdd(category)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {category}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="duration">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Estimate duration
                  </Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="trainer">
                    <Users className="w-4 h-4 inline mr-2" />
                    Trainer
                  </Label>
                  <Input
                    id="trainer"
                    placeholder="Select category or create one"
                    value={formData.trainer}
                    onChange={(e) => setFormData(prev => ({ ...prev, trainer: e.target.value }))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="language">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Language
                  </Label>
                  <Input
                    id="language"
                    value={formData.language}
                    onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-2 min-h-20"
                  placeholder="Let your learner know a little about this learning path"
                />
                <div className="text-right text-sm text-muted-foreground mt-1">
                  {formData.description.length}/400
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">Learning Path Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Estimated completion</span>
                    <span className="font-medium">1 Week</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Content items</span>
                    <span className="font-medium">0 items</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Assignments</span>
                    <span className="font-medium">0 assignments</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">Progress Overview</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Setup Progress</span>
                      <span>33%</span>
                    </div>
                    <Progress value={33} className="h-2" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Complete all steps to publish your learning path
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}