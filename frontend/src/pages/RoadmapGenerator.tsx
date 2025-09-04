import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Bot, 
  Sparkles, 
  Clock, 
  Users, 
  BookOpen, 
  CheckCircle, 
  ArrowRight,
  Lightbulb,
  Target,
  Zap,
  Globe,
  Video,
  FileText,
  ExternalLink,
  Star,
  TrendingUp,
  Brain,
  Rocket
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Mock data for generated roadmaps
const mockRoadmaps = {
  cybersecurity: {
    title: "Cybersecurity Fundamentals",
    description: "Master the essential concepts and practices of cybersecurity from basics to advanced techniques.",
    estimatedDuration: "12-16 weeks",
    difficulty: "Intermediate",
    prerequisites: [
      "Basic understanding of computer networks",
      "Familiarity with operating systems (Windows/Linux)",
      "Basic programming knowledge (any language)",
      "Understanding of web technologies (HTTP, DNS)"
    ],
    assumptions: [
      "You have access to a computer for hands-on practice",
      "You can dedicate 8-10 hours per week to learning",
      "You're comfortable with command-line interfaces",
      "You have basic problem-solving skills"
    ],
    modules: [
      {
        id: 1,
        title: "Introduction to Cybersecurity",
        description: "Understanding the cybersecurity landscape, threats, and basic concepts",
        estimatedTime: "1-2 weeks",
        topics: ["CIA Triad", "Threat Landscape", "Security Frameworks", "Risk Assessment"],
        resources: [
          { type: "video", title: "Cybersecurity Fundamentals", url: "youtube.com/watch?v=example1", rating: 4.8 },
          { type: "article", title: "NIST Cybersecurity Framework Guide", url: "nist.gov/framework", rating: 4.9 },
          { type: "course", title: "Introduction to Cyber Security", url: "coursera.org/cyber-intro", rating: 4.7 }
        ]
      },
      {
        id: 2,
        title: "Network Security Basics",
        description: "Learn about network protocols, firewalls, and network-based attacks",
        estimatedTime: "2-3 weeks",
        topics: ["TCP/IP Security", "Firewalls", "VPNs", "Network Monitoring", "Intrusion Detection"],
        resources: [
          { type: "video", title: "Network Security Explained", url: "youtube.com/watch?v=example2", rating: 4.6 },
          { type: "article", title: "Firewall Configuration Best Practices", url: "security.org/firewalls", rating: 4.8 },
          { type: "hands-on", title: "Wireshark Network Analysis Lab", url: "wireshark.org/labs", rating: 4.9 }
        ]
      },
      {
        id: 3,
        title: "Cryptography and Data Protection",
        description: "Understanding encryption, hashing, and data protection mechanisms",
        estimatedTime: "2-3 weeks",
        topics: ["Symmetric Encryption", "Asymmetric Encryption", "Hashing", "Digital Signatures", "PKI"],
        resources: [
          { type: "video", title: "Cryptography Crash Course", url: "youtube.com/watch?v=example3", rating: 4.7 },
          { type: "article", title: "Modern Cryptography Explained", url: "crypto.stanford.edu", rating: 4.9 },
          { type: "tool", title: "OpenSSL Practical Guide", url: "openssl.org/docs", rating: 4.5 }
        ]
      },
      {
        id: 4,
        title: "Web Application Security",
        description: "Securing web applications and understanding common vulnerabilities",
        estimatedTime: "3-4 weeks",
        topics: ["OWASP Top 10", "SQL Injection", "XSS", "CSRF", "Authentication", "Session Management"],
        resources: [
          { type: "video", title: "Web Security Fundamentals", url: "youtube.com/watch?v=example4", rating: 4.8 },
          { type: "hands-on", title: "OWASP WebGoat Practice", url: "owasp.org/webgoat", rating: 4.9 },
          { type: "article", title: "Secure Coding Practices", url: "owasp.org/secure-coding", rating: 4.7 }
        ]
      },
      {
        id: 5,
        title: "Incident Response and Forensics",
        description: "Learn how to respond to security incidents and conduct digital forensics",
        estimatedTime: "2-3 weeks",
        topics: ["Incident Response Process", "Digital Forensics", "Log Analysis", "Malware Analysis", "Recovery"],
        resources: [
          { type: "video", title: "Incident Response Methodology", url: "youtube.com/watch?v=example5", rating: 4.6 },
          { type: "course", title: "Digital Forensics Specialization", url: "coursera.org/forensics", rating: 4.8 },
          { type: "tool", title: "Autopsy Digital Forensics", url: "autopsy.com/download", rating: 4.7 }
        ]
      },
      {
        id: 6,
        title: "Advanced Topics and Specialization",
        description: "Explore advanced cybersecurity topics and choose your specialization",
        estimatedTime: "2-3 weeks",
        topics: ["Penetration Testing", "Threat Hunting", "Cloud Security", "IoT Security", "AI in Cybersecurity"],
        resources: [
          { type: "video", title: "Advanced Penetration Testing", url: "youtube.com/watch?v=example6", rating: 4.9 },
          { type: "certification", title: "CEH Certification Guide", url: "eccouncil.org/ceh", rating: 4.8 },
          { type: "article", title: "Cloud Security Best Practices", url: "aws.amazon.com/security", rating: 4.7 }
        ]
      }
    ]
  }
}

const resourceTypeIcons = {
  video: Video,
  article: FileText,
  course: BookOpen,
  'hands-on': Zap,
  tool: Target,
  certification: Star
}

export default function RoadmapGenerator() {
  const [topic, setTopic] = useState('')
  const [level, setLevel] = useState('')
  const [timeCommitment, setTimeCommitment] = useState('')
  const [goals, setGoals] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedRoadmap, setGeneratedRoadmap] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('generator')
  const navigate = useNavigate()

  const handleGenerate = async () => {
    if (!topic.trim()) return
    
    setIsGenerating(true)
    
    // Simulate AI generation delay
    setTimeout(() => {
      // For demo, use cybersecurity roadmap for any topic
      setGeneratedRoadmap(mockRoadmaps.cybersecurity)
      setIsGenerating(false)
      setActiveTab('roadmap')
    }, 3000)
  }

  const handleSaveRoadmap = () => {
    // Simulate saving roadmap
    console.log('Saving roadmap:', generatedRoadmap)
    navigate('/my-roadmaps')
  }

  const getResourceIcon = (type: string) => {
    const Icon = resourceTypeIcons[type as keyof typeof resourceTypeIcons] || FileText
    return Icon
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Roadmap Generator</h1>
              <p className="text-muted-foreground">Generate personalized learning paths powered by AI</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Content Curation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Personalized Learning Paths</span>
            </div>
            <div className="flex items-center space-x-2">
              <Rocket className="w-4 h-4" />
              <span>Industry-Relevant Skills</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="generator">Generate Roadmap</TabsTrigger>
            <TabsTrigger value="roadmap" disabled={!generatedRoadmap}>
              View Roadmap
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-8">
            {/* Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5" />
                  <span>What do you want to learn?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Learning Topic</label>
                  <Input
                    placeholder="e.g., Cybersecurity, Full Stack Development, Data Science, UI/UX Design..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="text-lg"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter any topic you want to master. Our AI will analyze and create a comprehensive learning path.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Current Level</label>
                    <Select value={level} onValueChange={setLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner - New to this field</SelectItem>
                        <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                        <SelectItem value="advanced">Advanced - Significant experience</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time Commitment</label>
                    <Select value={timeCommitment} onValueChange={setTimeCommitment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Hours per week" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5-10">5-10 hours/week</SelectItem>
                        <SelectItem value="10-15">10-15 hours/week</SelectItem>
                        <SelectItem value="15-20">15-20 hours/week</SelectItem>
                        <SelectItem value="20+">20+ hours/week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Learning Goals (Optional)</label>
                  <Textarea
                    placeholder="What specific skills or outcomes are you hoping to achieve? e.g., 'Get a job as a cybersecurity analyst', 'Build secure web applications', 'Pass security certifications'..."
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleGenerate}
                  disabled={!topic.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Bot className="w-5 h-5 mr-2 animate-spin" />
                      Generating Your Personalized Roadmap...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate AI Roadmap
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Features */}
            
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-8">
            {generatedRoadmap && (
              <>
                {/* Roadmap Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-2xl">{generatedRoadmap.title}</CardTitle>
                        <p className="text-muted-foreground">{generatedRoadmap.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <Badge variant="secondary">
                            <Clock className="w-3 h-3 mr-1" />
                            {generatedRoadmap.estimatedDuration}
                          </Badge>
                          <Badge variant="outline">
                            {generatedRoadmap.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <Button onClick={handleSaveRoadmap} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Save Roadmap
                      </Button>
                    </div>
                  </CardHeader>
                </Card>

                {/* Prerequisites & Assumptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Target className="w-5 h-5" />
                        <span>Prerequisites</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {generatedRoadmap.prerequisites.map((prereq: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{prereq}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Lightbulb className="w-5 h-5" />
                        <span>Assumptions</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {generatedRoadmap.assumptions.map((assumption: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{assumption}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Learning Modules */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">Learning Modules</h2>
                  <div className="space-y-6">
                    {generatedRoadmap.modules.map((module: any, index: number) => (
                      <Card key={module.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/30">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                                  {index + 1}
                                </div>
                                <CardTitle className="text-xl">{module.title}</CardTitle>
                              </div>
                              <p className="text-muted-foreground">{module.description}</p>
                              <Badge variant="outline">
                                <Clock className="w-3 h-3 mr-1" />
                                {module.estimatedTime}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6">
                          {/* Topics */}
                          <div className="mb-6">
                            <h4 className="font-semibold mb-3">Key Topics</h4>
                            <div className="flex flex-wrap gap-2">
                              {module.topics.map((topic: string, topicIndex: number) => (
                                <Badge key={topicIndex} variant="secondary">
                                  {topic}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Resources */}
                          <div>
                            <h4 className="font-semibold mb-3">Curated Resources</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {module.resources.map((resource: any, resourceIndex: number) => {
                                const Icon = getResourceIcon(resource.type)
                                return (
                                  <div key={resourceIndex} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-start space-x-3">
                                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-4 h-4 text-primary" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h5 className="font-medium text-sm truncate">{resource.title}</h5>
                                        <div className="flex items-center justify-between mt-2">
                                          <Badge variant="outline" className="text-xs">
                                            {resource.type}
                                          </Badge>
                                          <div className="flex items-center space-x-1">
                                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                            <span className="text-xs text-muted-foreground">{resource.rating}</span>
                                          </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-xs">
                                          <ExternalLink className="w-3 h-3 mr-1" />
                                          Open Resource
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
