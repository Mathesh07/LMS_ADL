import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft, 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Plus,
  MoreHorizontal,
  Hash,
  Quote,
  Code,
  Type,
  Palette
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

// Mock data for different learning paths
const mockNotesData = {
  '1': {
    title: 'UI/UX Design Fundamentals',
    category: 'Design & User Experience',
    lastEdited: '2 hours ago',
    blocks: [
      {
        type: 'heading',
        content: 'Design System Principles'
      },
      {
        type: 'text',
        content: 'A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications.'
      },
      {
        type: 'list',
        items: [
          'Consistency across all touchpoints',
          'Scalability for future growth',
          'Efficiency in design and development',
          'Brand coherence and recognition'
        ]
      },
      {
        type: 'code',
        language: 'css',
        content: `.design-token {\n  --primary-color: #6366f1;\n  --spacing-unit: 8px;\n  --border-radius: 6px;\n}`
      }
    ]
  },
  '2': {
    title: 'React Development Best Practices',
    category: 'Frontend Development',
    lastEdited: '1 day ago',
    blocks: [
      {
        type: 'heading',
        content: 'Component Architecture'
      },
      {
        type: 'text',
        content: 'Building maintainable React applications requires thoughtful component design and proper state management patterns.'
      },
      {
        type: 'list',
        items: [
          'Single Responsibility Principle',
          'Composition over inheritance',
          'Proper prop drilling management',
          'Custom hooks for reusable logic'
        ]
      },
      {
        type: 'code',
        language: 'jsx',
        content: `const useCounter = (initialValue = 0) => {\n  const [count, setCount] = useState(initialValue)\n  const increment = () => setCount(c => c + 1)\n  const decrement = () => setCount(c => c - 1)\n  return { count, increment, decrement }\n}`
      }
    ]
  },
  '3': {
    title: 'Data Structures & Algorithms',
    category: 'Computer Science',
    lastEdited: '3 days ago',
    blocks: [
      {
        type: 'heading',
        content: 'Big O Notation'
      },
      {
        type: 'text',
        content: 'Big O notation describes the performance or complexity of an algorithm in terms of time and space as the input size grows.'
      },
      {
        type: 'list',
        items: [
          'O(1) - Constant time complexity',
          'O(log n) - Logarithmic time complexity',
          'O(n) - Linear time complexity',
          'O(n²) - Quadratic time complexity'
        ]
      },
      {
        type: 'quote',
        content: 'Premature optimization is the root of all evil.',
        author: 'Donald Knuth'
      }
    ]
  }
}

export default function LearningPathNotes() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [title, setTitle] = useState("Untitled")
  const [content, setContent] = useState("")
  const [notesData, setNotesData] = useState(null)
  const [blocks, setBlocks] = useState([])
  const [editingBlock, setEditingBlock] = useState(null)

  useEffect(() => {
    if (id && mockNotesData[id]) {
      const data = mockNotesData[id]
      setNotesData(data)
      setTitle(data.title)
      setBlocks(data.blocks || [])
    } else {
      // Default empty state
      setBlocks([])
    }
  }, [id])

  const addBlock = (type = 'text', index = null) => {
    const newBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      items: type === 'list' ? [''] : undefined,
      language: type === 'code' ? 'javascript' : undefined
    }
    
    const newBlocks = [...blocks]
    if (index !== null) {
      newBlocks.splice(index + 1, 0, newBlock)
    } else {
      newBlocks.push(newBlock)
    }
    
    setBlocks(newBlocks)
    setEditingBlock(newBlock.id)
  }

  const updateBlock = (blockId, updates) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    ))
  }

  const deleteBlock = (blockId) => {
    setBlocks(blocks.filter(block => block.id !== blockId))
  }

  const moveBlock = (blockId, direction) => {
    const currentIndex = blocks.findIndex(block => block.id === blockId)
    if (currentIndex === -1) return
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= blocks.length) return
    
    const newBlocks = [...blocks]
    const [movedBlock] = newBlocks.splice(currentIndex, 1)
    newBlocks.splice(newIndex, 0, movedBlock)
    setBlocks(newBlocks)
  }
  
  const toolbarButtons = [
    { icon: Type, label: "Text", shortcut: "T" },
    { icon: Hash, label: "Heading", shortcut: "H" },
    { icon: List, label: "Bullet List" },
    { icon: ListOrdered, label: "Numbered List" },
    { icon: Quote, label: "Quote" },
    { icon: Code, label: "Code" },
    { icon: Image, label: "Image" },
    { icon: Link, label: "Link" },
  ]

  const formatButtons = [
    { icon: Bold, label: "Bold", shortcut: "Ctrl+B" },
    { icon: Italic, label: "Italic", shortcut: "Ctrl+I" },
    { icon: Underline, label: "Underline", shortcut: "Ctrl+U" },
  ]

  const alignButtons = [
    { icon: AlignLeft, label: "Align Left" },
    { icon: AlignCenter, label: "Align Center" },
    { icon: AlignRight, label: "Align Right" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/learning-path/content')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-content-page rounded-md flex items-center justify-center">
                <Type className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">
                {notesData?.category || 'General Knowledge & Methodology'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
            <Button size="sm" className="bg-gradient-primary hover:opacity-90">
              Publish
            </Button>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="bg-card border-b border-border px-4 py-2">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-1">
            {/* Content Type Buttons */}
            <div className="flex items-center space-x-1 mr-4 p-1 bg-muted rounded-lg">
              {toolbarButtons.map((button, index) => (
                <Button 
                  key={index}
                  variant="ghost" 
                  size="sm"
                  className="h-8 px-2 hover:bg-background"
                  title={`${button.label} ${button.shortcut ? `(${button.shortcut})` : ''}`}
                  onClick={() => {
                    const type = button.label.toLowerCase().replace(' ', '')
                    addBlock(type === 'bulletlist' ? 'list' : type === 'text' ? 'text' : type)
                  }}
                >
                  <button.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>

            {/* Format Buttons */}
            <div className="flex items-center space-x-1 mr-4">
              {formatButtons.map((button, index) => (
                <Button 
                  key={index}
                  variant="ghost" 
                  size="sm"
                  className="h-8 px-2"
                  title={`${button.label} (${button.shortcut})`}
                >
                  <button.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>

            {/* Alignment Buttons */}
            <div className="flex items-center space-x-1">
              {alignButtons.map((button, index) => (
                <Button 
                  key={index}
                  variant="ghost" 
                  size="sm"
                  className="h-8 px-2"
                  title={button.label}
                >
                  <button.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </div>

          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Palette className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-4xl font-bold border-none p-0 bg-transparent focus-visible:ring-0 shadow-none"
              placeholder="Untitled"
            />
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Last edited {notesData?.lastEdited || '2 hours ago'}</span>
              <span>•</span>
              <span>Auto-save enabled</span>
            </div>
          </div>

          {/* Content Editor */}
          <div className="space-y-4">
            {/* Add Content Button */}
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-foreground h-12 text-base"
              onClick={() => addBlock('text')}
            >
              <Plus className="w-5 h-5 mr-3" />
              Press / for commands, or click to add content
            </Button>

            {/* Dynamic Content Blocks */}
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <div key={block.id || index} className="group relative">
                  <div className="absolute -left-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col space-y-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => addBlock('text', index)}
                      title="Add block below"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => deleteBlock(block.id || index.toString())}
                      title="Delete block"
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  {block.type === 'heading' && (
                    editingBlock === (block.id || index.toString()) ? (
                      <Input
                        value={block.content || ''}
                        onChange={(e) => updateBlock(block.id || index.toString(), { content: e.target.value })}
                        onBlur={() => setEditingBlock(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setEditingBlock(null)
                            addBlock('text', index)
                          }
                        }}
                        className="text-2xl font-semibold border-none p-0 bg-transparent focus-visible:ring-0 shadow-none"
                        placeholder="Heading"
                        autoFocus
                      />
                    ) : (
                      <h2 
                        className="text-2xl font-semibold text-foreground cursor-pointer hover:bg-muted/50 rounded p-1 -m-1"
                        onClick={() => setEditingBlock(block.id || index.toString())}
                      >
                        {block.content || 'Click to edit heading'}
                      </h2>
                    )
                  )}
                  
                  {block.type === 'text' && (
                    editingBlock === (block.id || index.toString()) ? (
                      <Textarea
                        value={block.content || ''}
                        onChange={(e) => updateBlock(block.id || index.toString(), { content: e.target.value })}
                        onBlur={() => setEditingBlock(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            setEditingBlock(null)
                            addBlock('text', index)
                          }
                        }}
                        className="border-none p-0 bg-transparent focus-visible:ring-0 shadow-none resize-none min-h-[24px]"
                        placeholder="Type something..."
                        autoFocus
                        rows={1}
                      />
                    ) : (
                      <p 
                        className="text-foreground leading-relaxed cursor-pointer hover:bg-muted/50 rounded p-1 -m-1 min-h-[24px]"
                        onClick={() => setEditingBlock(block.id || index.toString())}
                      >
                        {block.content || 'Click to add text'}
                      </p>
                    )
                  )}
                  
                  {block.type === 'list' && (
                    <ul className="space-y-2 text-foreground">
                      {(block.items || ['']).map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                          {editingBlock === `${block.id || index}-${itemIndex}` ? (
                            <Input
                              value={item}
                              onChange={(e) => {
                                const newItems = [...(block.items || [''])]
                                newItems[itemIndex] = e.target.value
                                updateBlock(block.id || index.toString(), { items: newItems })
                              }}
                              onBlur={() => setEditingBlock(null)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const newItems = [...(block.items || [''])]
                                  newItems.splice(itemIndex + 1, 0, '')
                                  updateBlock(block.id || index.toString(), { items: newItems })
                                  setEditingBlock(`${block.id || index}-${itemIndex + 1}`)
                                }
                              }}
                              className="border-none p-0 bg-transparent focus-visible:ring-0 shadow-none"
                              placeholder="List item"
                              autoFocus
                            />
                          ) : (
                            <span 
                              className="cursor-pointer hover:bg-muted/50 rounded px-1 -mx-1 flex-1"
                              onClick={() => setEditingBlock(`${block.id || index}-${itemIndex}`)}
                            >
                              {item || 'Click to edit'}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {block.type === 'code' && (
                    <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                      <div className="text-muted-foreground mb-2">{(block.language || 'javascript').toUpperCase()} Code:</div>
                      {editingBlock === (block.id || index.toString()) ? (
                        <Textarea
                          value={block.content || ''}
                          onChange={(e) => updateBlock(block.id || index.toString(), { content: e.target.value })}
                          onBlur={() => setEditingBlock(null)}
                          className="bg-transparent border-none p-0 focus-visible:ring-0 shadow-none font-mono text-sm text-foreground resize-none"
                          placeholder="Enter your code here..."
                          autoFocus
                          rows={4}
                        />
                      ) : (
                        <code 
                          className="text-foreground whitespace-pre-wrap cursor-pointer hover:bg-background/50 rounded p-1 -m-1 block"
                          onClick={() => setEditingBlock(block.id || index.toString())}
                        >
                          {block.content || 'Click to add code'}
                        </code>
                      )}
                    </div>
                  )}
                  
                  {block.type === 'quote' && (
                    editingBlock === (block.id || index.toString()) ? (
                      <div className="border-l-4 border-primary pl-4">
                        <Textarea
                          value={block.content || ''}
                          onChange={(e) => updateBlock(block.id || index.toString(), { content: e.target.value })}
                          onBlur={() => setEditingBlock(null)}
                          className="border-none p-0 bg-transparent focus-visible:ring-0 shadow-none italic text-muted-foreground resize-none"
                          placeholder="Enter quote..."
                          autoFocus
                          rows={2}
                        />
                        <Input
                          value={block.author || ''}
                          onChange={(e) => updateBlock(block.id || index.toString(), { author: e.target.value })}
                          className="text-sm mt-2 border-none p-0 bg-transparent focus-visible:ring-0 shadow-none"
                          placeholder="Author (optional)"
                        />
                      </div>
                    ) : (
                      <blockquote 
                        className="border-l-4 border-primary pl-4 italic text-muted-foreground cursor-pointer hover:bg-muted/50 rounded p-1 -m-1"
                        onClick={() => setEditingBlock(block.id || index.toString())}
                      >
                        "{block.content || 'Click to add quote'}"
                        {block.author && (
                          <footer className="text-sm mt-2 not-italic">— {block.author}</footer>
                        )}
                      </blockquote>
                    )
                  )}
                </div>
              ))}
              
              {blocks.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No content yet. Click the button above to start adding blocks!</p>
                </div>
              )}

              {/* Add another content block */}
              {blocks.length > 0 && (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:text-foreground h-10 mt-8"
                  onClick={() => addBlock('text')}
                >
                  <Plus className="w-4 h-4 mr-3" />
                  Add a block
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}