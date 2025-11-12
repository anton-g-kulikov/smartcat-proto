# Chats Feature Specification

This document describes the Chats feature for the Smartcat prototyping project. The Chats feature provides an AI-powered chat interface where users can interact with Smartcat's AI assistant to get help, ask questions, and receive detailed responses.

> **Note**: This feature will be developed in a dedicated git branch. Mobile responsiveness is not required for this implementation.

---

## 1) Purpose

Provide an AI chat interface that allows users to:
- Interact with Smartcat's AI assistant
- View and manage chat history
- Ask questions and receive detailed, formatted responses
- Provide feedback on responses (Helpful/Not helpful)
- Start new conversations
- Search through chat history

---

## 2) Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Left Nav  │  Chat Sidebar  │  Main Chat Area          │
│  (~72px)   │  (~280px)      │  (flex-1)                │
│            │                │                          │
│  [Org]     │  ┌──────────┐  │  ┌────────────────────┐  │
│  [Home]    │  │ Chats    │  │  │ Smartcat Header   │  │
│  [Hub]     │  │ ←        │  │  │ "I'm here to help"│  │
│  [Chats] ✓ │  ├──────────┤  │  ├────────────────────┤  │
│  [User]    │  │ Chat 1   │  │  │ User Query        │  │
│  [Work]    │  │ Chat 2 ✓ │  │  │ AI Response       │  │
│  [Tour]    │  │ Chat 3   │  │  │ [Feedback btns]   │  │
│            │  │ ...      │  │  ├────────────────────┤  │
│            │  ├──────────┤  │  │ Input Field        │  │
│            │  │ [Tour]   │  │  │ [Send Button]      │  │
│            │  │ [+ New]  │  │  └────────────────────┘  │
│            │  │ [Search] │  │                          │
│            │  └──────────┘  │                          │
└─────────────────────────────────────────────────────────┘
│  Bottom Banner: Premium Features Promotion              │
└─────────────────────────────────────────────────────────┘
```

**Key Points:**
- Left navigation panel remains visible (~72px)
- Chat sidebar appears when on Chats page (~280px width)
- Main chat area takes remaining width
- Full height layout with bottom banner

---

## 3) Components

### 3.1 Chat Sidebar

**Location**: Between left nav panel and main content area, visible when on `/chats` route

**Width**: ~280px

**Structure** (top to bottom):
1. **Header Section**:
   - Circular icon with "S" (Smartcat logo, pink/red background)
   - "Chats" label
   - Left arrow icon (collapse/back button)

2. **Chat History List**:
   - Scrollable list of previous chat conversations
   - Each item shows truncated chat title/query
   - Active chat is highlighted (light gray background)
   - Clicking a chat loads it in main area

3. **Bottom Actions**:
   - "Tour" icon with label
   - "+ New chat" button (prominent, purple/dark background)
   - Search icon

**Styling**:
- Light gray background
- Scrollable chat list
- Hover states for chat items
- Active chat highlighting

**Features**:
- Chat history persists (mock data for prototype)
- Clicking chat item loads conversation
- "+ New chat" starts fresh conversation
- Search functionality (placeholder for prototype)

### 3.2 Main Chat Area

**Location**: Main content area, right side of chat sidebar

**Structure** (top to bottom):

1. **AI Assistant Header**:
   - Circular icon with "SC" (Smartcat logo, purple background)
   - "Smartcat" label (bold)
   - "I'm here to help" tagline (smaller, gray text)

2. **Initial Instruction** (when no conversation):
   - Text: "Please formulate your requirement to leverage skills"
   - Or similar placeholder text

3. **Conversation Area**:
   - **User Messages**: 
     - Displayed as purple button-like elements or bubbles
     - Shows user's question/query
   - **AI Responses**:
     - Detailed text responses
     - Numbered lists for step-by-step instructions
     - Links to help articles
     - Formatted with proper typography
   - **Feedback Buttons** (after each AI response):
     - "Helpful" button with thumbs-up icon
     - "Not helpful" button with thumbs-down icon
     - Positioned below AI response

4. **Related Articles/Suggestions** (optional):
   - Card-like elements with book icon
   - "SmartCat Help >" with snippet
   - Clickable to view full article

5. **Input Area**:
   - Text input field with placeholder (e.g., "How do I translate PDFs?")
   - Send button (circular, purple/dark background, arrow icon)
   - Positioned at bottom of conversation

**Styling**:
- White background
- Proper spacing between messages
- Typography hierarchy
- Scrollable conversation area

**Features**:
- Auto-scroll to bottom on new messages
- Message formatting (bold, lists, links)
- Feedback collection (mock for prototype)
- Input submission on Enter key or button click

### 3.3 Bottom Banner

**Location**: Fixed at bottom of entire application (below main content)

**Content**:
- Left side: Promotional text
  - "Ready to supercharge your productivity? Unlock all premium features and see how our platform helps your team achieve more in less time."
- Right side: "Explore features" button (dark gray/black background)

**Styling**:
- Light beige/gray background
- Full width
- Fixed position at bottom

---

## 4) Pages & Routes

### 4.1 Chats Page

- **Route**: `/chats`
- **Component**: `ChatsPage` (new)
- **Description**: Main chat interface with sidebar and conversation area
- **Sub-routes** (optional for future):
  - `/chats/:chatId` - Specific chat conversation

---

## 5) Technical Implementation

### 5.1 Component Structure

```
src/
├── components/
│   ├── chats/
│   │   ├── ChatSidebar.tsx        # Chat history sidebar
│   │   ├── ChatConversation.tsx   # Main conversation area
│   │   ├── ChatMessage.tsx        # Individual message component
│   │   ├── ChatInput.tsx          # Input field with send button
│   │   ├── FeedbackButtons.tsx    # Helpful/Not helpful buttons
│   │   └── RelatedArticles.tsx    # Related articles section (optional)
│   └── layout/
│       └── AppLayout.tsx           # Update to handle chat sidebar
├── pages/
│   └── ChatsPage.tsx              # Main chats page
├── mocks/
│   └── chats.ts                   # Mock chat data
└── types/
    └── chats.ts                   # TypeScript types
```

### 5.2 Dependencies Needed

**Already installed**:
- ✅ `react-router-dom` - Routing
- ✅ `lucide-react` - Icons
- ✅ `@radix-ui/react-popover` - (for future features)

**May need to add**:
- `react-markdown` (optional, for formatted responses)
- `date-fns` (optional, for date formatting)

### 5.3 Routing Updates

Update `src/App.tsx` to include:
```tsx
<Route path="/chats" element={<ChatsPage />} />
```

### 5.4 Layout Updates

Update `AppLayout` to conditionally show chat sidebar when on `/chats` route:
- Chat sidebar appears between left nav and main content
- Main content area adjusts width accordingly

---

## 6) Data Model

### 6.1 Chat

```ts
type Chat = {
  id: string
  title: string // First user message or generated title
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  messages: Message[]
  active?: boolean
}
```

### 6.2 Message

```ts
type Message = {
  id: string
  chatId: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string // ISO date string
  feedback?: 'helpful' | 'not-helpful' | null
}
```

### 6.3 Chat History Item

```ts
type ChatHistoryItem = {
  id: string
  title: string
  preview: string // Truncated first message or response
  updatedAt: string
  active?: boolean
}
```

---

## 7) States & Behavior

### 7.1 Chat Selection
- Clicking a chat in sidebar loads it in main area
- Active chat is highlighted in sidebar
- URL can optionally reflect current chat: `/chats/:chatId`

### 7.2 New Chat
- Clicking "+ New chat" creates new empty conversation
- Clears main conversation area
- Shows initial instruction/placeholder

### 7.3 Message Sending
- User types in input field
- Pressing Enter or clicking send button submits message
- Message appears immediately in conversation
- AI response appears after brief delay (mock)
- Auto-scroll to bottom

### 7.4 Feedback
- Clicking "Helpful" or "Not helpful" records feedback
- Button state changes to show selection
- Feedback stored in message object (mock)

### 7.5 Search
- Search icon opens search interface (placeholder for prototype)
- Can search through chat history by title/content

---

## 8) Styling Guidelines

### 8.1 Design Tokens
- Use Smartcat CSS variables: `var(--sc-*)`
- Use shadcn/ui theme variables where appropriate
- Maintain consistency with Smartcat design system

### 8.2 Spacing & Layout
- Chat sidebar: Fixed width ~280px
- Main chat area: Takes remaining width (flex-1)
- Padding: Consistent spacing using Tailwind utilities
- Message spacing: Adequate gap between messages

### 8.3 Typography
- User messages: Medium weight, readable size
- AI responses: Regular weight, proper line height
- Headers: Bold, appropriate hierarchy
- Links: Underlined, colored appropriately

### 8.4 Colors
- User message bubbles: Purple background
- AI responses: White background, dark text
- Active chat: Light gray background
- Send button: Purple/dark background
- Feedback buttons: Subtle styling

### 8.5 Avatar Styling
- Smartcat logo: Purple background with white "SC"
- Chat sidebar logo: Pink/red background with white "S"
- Circular avatars, consistent sizing

---

## 9) Accessibility

- All interactive elements keyboard accessible
- Input field properly labeled
- Send button has aria-label
- Feedback buttons have aria-labels
- Chat history items have proper focus indicators
- Screen reader announcements for new messages
- Proper heading hierarchy

---

## 10) Acceptance Criteria

- [ ] Chat sidebar renders when on `/chats` route
- [ ] Chat history list displays with mock data
- [ ] Clicking chat item loads conversation in main area
- [ ] Active chat is highlighted in sidebar
- [ ] "+ New chat" button creates new conversation
- [ ] Main chat area shows AI assistant header
- [ ] User messages display correctly
- [ ] AI responses display with proper formatting
- [ ] Feedback buttons appear after AI responses
- [ ] Feedback buttons record selection (mock)
- [ ] Input field accepts text and submits on Enter/click
- [ ] Send button submits message
- [ ] New messages appear in conversation
- [ ] Auto-scroll to bottom on new messages
- [ ] Bottom banner displays premium features promotion
- [ ] Styling matches Smartcat design tokens
- [ ] All routes accessible via navigation
- [ ] Chat sidebar collapses/expands appropriately

---

## 11) Mock Data

Create `src/mocks/chats.ts`:

```ts
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
        content: 'Here are the best practices for translation projects...',
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
  // ... more mock chats
]

export const mockInitialInstruction = "Please formulate your requirement to leverage skills"
```

---

## 12) Implementation Notes

1. **Chat Sidebar**: Appears conditionally when on `/chats` route
2. **Message Formatting**: Support basic markdown or HTML for AI responses
3. **Auto-scroll**: Use `scrollIntoView` or refs to scroll to bottom
4. **State Management**: Use React state for current chat, messages
5. **Mock Responses**: Simulate AI response delay (setTimeout)
6. **Feedback**: Store feedback in message object (mock, no persistence)
7. **Search**: Placeholder for now, can be enhanced later
8. **New Chat**: Clears current conversation, creates new chat object
9. **Styling**: Match design from screenshots, use Smartcat tokens
10. **Icons**: Use `lucide-react` for all icons

---

## 13) Future Enhancements (Out of Scope)

- Real AI integration
- Chat persistence (localStorage or backend)
- Search functionality
- Chat deletion/archiving
- Chat renaming
- Message editing
- File attachments
- Code syntax highlighting
- Markdown rendering
- Voice input
- Chat export
- Multi-turn conversation context
- Related articles integration

---

## 14) Visual Reference

**Screenshots available in `_meta/chats/`:**
- `Screenshot 2025-11-12 at 17.31.18.png` - Initial chat interface
- `Screenshot 2025-11-12 at 17.31.22.png` - Chat with conversation
- `Screenshot 2025-11-12 at 17.31.28.png` - Detailed AI response
- `Screenshot 2025-11-12 at 17.31.33.png` - Another conversation example

---

## 15) Next Steps

1. Create `ChatsPage` component
2. Create `ChatSidebar` component with chat history
3. Create `ChatConversation` component for main area
4. Create `ChatMessage` component for individual messages
5. Create `ChatInput` component with send button
6. Create `FeedbackButtons` component
7. Add mock data for chats and messages
8. Add TypeScript types
9. Update `AppLayout` to conditionally show chat sidebar
10. Update routing in `App.tsx`
11. Style with Smartcat tokens
12. Test chat selection and message flow
13. Add auto-scroll functionality
14. Implement feedback buttons
15. Add bottom banner component

