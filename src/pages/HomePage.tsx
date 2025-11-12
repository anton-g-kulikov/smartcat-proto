import { useState } from 'react'
import { Send, Sparkles, FileText, Globe, Users } from 'lucide-react'
import { mockUser } from '@/mocks/navigation'

export default function HomePage() {
  const [input, setInput] = useState('')
  const user = mockUser

  const suggestedPrompts = [
    { id: '1', label: 'Create a new project', icon: FileText },
    { id: '2', label: 'Translate a document', icon: Globe },
    { id: '3', label: 'Manage team members', icon: Users },
    { id: '4', label: 'View analytics', icon: Sparkles },
  ]

  const agentTeam = [
    { id: '1', name: 'Translation Assistant', description: 'Helps with translation tasks', icon: Globe },
    { id: '2', name: 'Project Manager', description: 'Manages your projects', icon: FileText },
    { id: '3', name: 'Team Coordinator', description: 'Coordinates team activities', icon: Users },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle submission
    console.log('Submitted:', input)
  }

  return (
    <div className="min-h-full p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            What's on your mind today, {user.name.split(' ')[0]}?
          </h1>
        </div>

        {/* Input Field */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--sc-primary)] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[var(--sc-primary)] text-white hover:opacity-90 transition-opacity"
              aria-label="Submit"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Suggested Prompts */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-gray-700">Suggested prompts</h2>
          <div className="grid grid-cols-2 gap-3">
            {suggestedPrompts.map((prompt) => {
              const Icon = prompt.icon
              return (
                <button
                  key={prompt.id}
                  onClick={() => setInput(prompt.label)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white hover:border-[var(--sc-primary)] hover:bg-gray-50 transition-colors text-left"
                >
                  <Icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{prompt.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Agent Team Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Agent team</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                All
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-transparent border border-transparent rounded-lg hover:bg-gray-100">
                Active
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-transparent border border-transparent rounded-lg hover:bg-gray-100">
                Inactive
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentTeam.map((agent) => {
              const Icon = agent.icon
              return (
                <div
                  key={agent.id}
                  className="p-4 rounded-lg border border-gray-200 bg-white hover:border-[var(--sc-primary)] transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <Icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900">{agent.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{agent.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
