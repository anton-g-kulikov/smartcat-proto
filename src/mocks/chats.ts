import type { Chat } from '../types/chats'

export const mockChats: Chat[] = [
  {
    id: '1',
    title: 'What are the best practices for...',
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:05:00Z',
    messages: [
      {
        id: 'm1',
        chatId: '1',
        role: 'user',
        content: 'What are the best practices for translation projects?',
        timestamp: '2025-01-10T10:00:00Z',
      },
      {
        id: 'm2',
        chatId: '1',
        role: 'assistant',
        content: 'Here are the best practices for translation projects:\n\n1. Plan your project timeline carefully\n2. Use consistent terminology\n3. Review translations with native speakers\n4. Maintain style guides\n5. Leverage translation memory for consistency',
        timestamp: '2025-01-10T10:00:30Z',
      },
    ],
  },
  {
    id: '2',
    title: 'How do I translate PDFs?',
    createdAt: '2025-01-10T11:00:00Z',
    updatedAt: '2025-01-10T11:10:00Z',
    active: true,
    messages: [
      {
        id: 'm3',
        chatId: '2',
        role: 'user',
        content: 'How do I translate PDFs?',
        timestamp: '2025-01-10T11:00:00Z',
      },
      {
        id: 'm4',
        chatId: '2',
        role: 'assistant',
        content: `To translate PDFs in Smartcat, follow these steps:

1. **Log in to Smartcat**: Create a free trial account if needed.

2. **Start a New Translation Task**: Click "Translate a file".

3. **Choose Languages and Upload Your Document**: Select source/target languages (supports up to 280), upload PDF by dragging/dropping or selecting.

4. **Translate the File**: Click "Translate files," Smartcat uses AI and OCR.

5. **Review and Edit Your Translation**: Download, share with collaborators, or invite professional editors.

6. **Use the Smartcat Editor**: For further edits, view source and target languages side-by-side.

7. **Finalize and Download**: Download the final translated PDF.

For more detailed instructions, see [how to translate a file in Smartcat](https://help.smartcat.com).`,
        timestamp: '2025-01-10T11:00:30Z',
      },
    ],
  },
  {
    id: '3',
    title: 'Can you generate a quiz "10 fac..."',
    createdAt: '2025-01-10T12:00:00Z',
    updatedAt: '2025-01-10T12:05:00Z',
    messages: [
      {
        id: 'm5',
        chatId: '3',
        role: 'user',
        content: 'Can you generate a quiz "10 facts about translation"?',
        timestamp: '2025-01-10T12:00:00Z',
      },
      {
        id: 'm6',
        chatId: '3',
        role: 'assistant',
        content: 'I can help you create a quiz about translation. Here are 10 interesting facts about translation...',
        timestamp: '2025-01-10T12:00:30Z',
      },
    ],
  },
  {
    id: '4',
    title: 'Show me my project list',
    createdAt: '2025-01-10T13:00:00Z',
    updatedAt: '2025-01-10T13:02:00Z',
    messages: [
      {
        id: 'm7',
        chatId: '4',
        role: 'user',
        content: 'Show me my project list',
        timestamp: '2025-01-10T13:00:00Z',
      },
      {
        id: 'm8',
        chatId: '4',
        role: 'assistant',
        content: 'Here is your current project list...',
        timestamp: '2025-01-10T13:00:30Z',
      },
    ],
  },
  {
    id: '5',
    title: "Let's create a list of product de...",
    createdAt: '2025-01-10T14:00:00Z',
    updatedAt: '2025-01-10T14:05:00Z',
    messages: [
      {
        id: 'm9',
        chatId: '5',
        role: 'user',
        content: "Let's create a list of product descriptions",
        timestamp: '2025-01-10T14:00:00Z',
      },
      {
        id: 'm10',
        chatId: '5',
        role: 'assistant',
        content: 'I can help you create product descriptions. What type of products are you working with?',
        timestamp: '2025-01-10T14:00:30Z',
      },
    ],
  },
  {
    id: '6',
    title: 'Are there unpaid invoices I nee...',
    createdAt: '2025-01-10T15:00:00Z',
    updatedAt: '2025-01-10T15:03:00Z',
    messages: [
      {
        id: 'm11',
        chatId: '6',
        role: 'user',
        content: 'Are there unpaid invoices I need to handle?',
        timestamp: '2025-01-10T15:00:00Z',
      },
      {
        id: 'm12',
        chatId: '6',
        role: 'assistant',
        content: 'Let me check your invoices. You have 2 unpaid invoices that need attention...',
        timestamp: '2025-01-10T15:00:30Z',
      },
    ],
  },
  {
    id: '7',
    title: 'I want to write a short list of Pr...',
    createdAt: '2025-01-10T16:00:00Z',
    updatedAt: '2025-01-10T16:04:00Z',
    messages: [
      {
        id: 'm13',
        chatId: '7',
        role: 'user',
        content: 'I want to write a short list of product requirements',
        timestamp: '2025-01-10T16:00:00Z',
      },
      {
        id: 'm14',
        chatId: '7',
        role: 'assistant',
        content: 'I can help you create a product requirements list. What product are you working on?',
        timestamp: '2025-01-10T16:00:30Z',
      },
    ],
  },
]

export const mockInitialInstruction = "Please formulate your requirement to leverage skills"

// Mock AI response generator (simulates API call)
export const generateMockAIResponse = (userMessage: string): string => {
  // Simple mock responses based on keywords
  if (userMessage.toLowerCase().includes('how does smartcat work')) {
    return `Smartcat is an AI-driven translation and content management platform designed to streamline the creation and localization of content for global audiences. Here's how Smartcat works:

1. **Effortless Project Onboarding and Creation**: Access your workspace dashboard, create translation projects, upload various file types, and use templates.

2. **Unified Workspace Experience**: Add team members, collaborate with third-party vendors, and work together seamlessly.

3. **AI-Powered Translation Workflow**: Leverage AI for fast and accurate translations with customizable workflows for review, editing, and approval.

4. **Collaborative Editing Environment**: Edit in real-time with side-by-side source and translated content, preview outputs, and provide feedback.

5. **Learning Content Creation**: Create SCORM-compliant courses and export for Learning Management Systems.

6. **Seamless Integrations**: Integrate with third-party tools for automatic translation updates.

7. **Automation and Flexibility**: Automate repetitive tasks, customize workflows, monitor projects, manage resources, and generate reports.

8. **Marketplace and Payments**: Hire professional linguists through the marketplace, handle payments, invoicing, and vendor management.

9. **Security and Access Control**: Enterprise-level security with single sign-on, data security, and access controls.

In summary, Smartcat provides a unified, collaborative, and AI-powered platform for managing translation and localization projects efficiently, making it suitable for individuals, teams, and enterprises looking to produce localized content quickly and accurately.

For more details, see [Meet Smartcat](https://smartcat.com) and [Pre-payments on Marketplace | Smartcat Help Center](https://help.smartcat.com).`
  }
  
  if (userMessage.toLowerCase().includes('translate')) {
    return `I can help you with translation tasks. Here are the main ways to translate content in Smartcat:

1. **File Translation**: Upload files directly and let Smartcat's AI translate them
2. **Editor Translation**: Use the Smartcat Editor for manual translation and editing
3. **API Integration**: Use Smartcat's API for automated translation workflows

What type of content would you like to translate?`
  }
  
  // Default response
  return `I understand you're asking about "${userMessage}". Let me help you with that. Smartcat offers various features to assist with translation and content management. Could you provide more details about what specifically you'd like to accomplish?`
}

