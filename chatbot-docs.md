# Chatbot Documentation

## Source Code and API Integration

- **UI Component:** `components/ChatBot.tsx` — Implements the modern, rose-themed health chatbot UI using React and Tailwind CSS.
- **API Route:** `app/api/openai-chat/route.ts` — Handles chat requests, integrates with the Gemini API, and enforces health-only responses.
- **API Key:** Set `GEMINI_API_KEY` in your `.env.local` file for secure Gemini API access.
- **Integration Flow:**
  1. The UI sends user messages to `/api/openai-chat`.
  2. The API route formats the request for Gemini, including a system prompt to restrict answers to health topics.
  3. Gemini's response is returned and displayed in the chat UI.

**API Route Example:**
```ts
// app/api/openai-chat/route.ts
const systemPrompt = {
  text: "You are a helpful assistant that only answers health-related questions. If the question is not about health, politely refuse to answer."
};
const userParts = messages.filter(m => m.role === "user").map(m => ({ text: m.content }));
const body = {
  contents: [
    { parts: [systemPrompt, ...userParts.length > 0 ? userParts : [{ text: "Hello!" }]] }
  ]
};
const apiRes = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-goog-api-key": process.env.GEMINI_API_KEY || "",
    },
    body: JSON.stringify(body),
  }
);
```

**ChatBot UI Fetch Example:**
```ts
// components/ChatBot.tsx (inside handleSend)
const res = await fetch("/api/openai-chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: [ ...messages, userMessage ] }),
});
const data = await res.json();
setMessages(msgs => [...msgs, { role: "bot", content: data.answer }]);
```

## Design Choices

- **UI Framework:** The chatbot UI uses shadcn/ui patterns and Tailwind CSS for a modern, accessible, and responsive design. The UI is themed with rose (pink/rose) as the primary accent color for a warm, health/wellness feel. The floating widget ensures the chat is always accessible without interfering with the main content.
- **Component Structure:** The ChatBot component is self-contained and rendered on every page via `app/page.tsx`. It uses React state for chat history and input management.
- **API Route:** The backend logic is handled by a Next.js API route (`app/api/openai-chat/route.ts`), which securely communicates with the Gemini API.

## Gemini API Usage

- The API route receives a POST request with the chat history (messages array).
- It sends a request to the Gemini API endpoint, prepending a system prompt: _"You are a helpful assistant that only answers health-related questions. If the question is not about health, politely refuse to answer."_
- The Gemini API key is read from the environment variable `GEMINI_API_KEY` (not hardcoded for security).
- The response is returned to the frontend and displayed in the chat.

## Conversational Flow

1. **User opens the chat widget** and types a health-related question.
2. **On send:**
   - The message is added to the chat history.
   - The frontend sends the chat history to `/api/openai-chat`.
   - The backend calls Gemini and returns the assistant's reply.
   - The reply is appended to the chat.
3. **Domain Restriction:**
   - If the user asks a non-health question, the assistant politely refuses, as instructed by the system prompt.

## Example Transcript

**User:** hello

**Bot:** Hello! I'm ready to answer your health-related questions. How can I help you today?

**User:** What is malaria?

**Bot:** Malaria is a serious and sometimes life-threatening disease caused by parasites. These parasites are transmitted to humans through the bites of infected female Anopheles mosquitoes. Malaria is preventable and curable.

**User:** What is HIV?

**Bot:** Malaria is a life-threatening disease caused by parasites that are transmitted to people through the bites of infected female Anopheles mosquitoes. It is preventable and curable. HIV (Human Immunodeficiency Virus) is a virus that attacks the body's immune system. If HIV is not treated, it can lead to AIDS (Acquired Immunodeficiency Syndrome). There is currently no cure for HIV, but effective antiretroviral therapy (ART) can control the virus and help prevent transmission.

## Expanded Discussion of Design Choices

### Color and Theme Rationale
- **Rose as Primary Accent:** Rose (pink/rose) is associated with care, compassion, and wellness. It is inclusive, modern, and less clinical than blue or green, making the chatbot feel welcoming and supportive for a broad audience.
- **Visual Calm:** The use of soft backgrounds, subtle borders, and gentle accent colors helps reduce user anxiety and creates a sense of trust and safety, which is important for health-related interactions.

### Why Gemini API?
- **Health Data and Reliability:** Gemini (Google) is a trusted provider with strong infrastructure and up-to-date health knowledge, making it suitable for health Q&A.
- **Prompt Control:** The API allows for precise prompt engineering, ensuring the assistant only answers health-related questions and refuses others, which is critical for safety and compliance.
- **Scalability:** Gemini's API is robust and can handle high traffic, making it suitable for production health chatbots.

### Security Considerations
- **API Key Security:** The Gemini API key is stored in `.env.local` and never exposed to the client. All API calls are made server-side.
- **No PHI Stored:** The chatbot does not store or log any personal health information (PHI). All conversations are ephemeral and processed in-memory only.
- **CORS and Data Privacy:** The API route is protected by Next.js serverless functions, and no sensitive data is sent to third parties except Gemini.

### Accessibility
- **Contrast and Readability:** The rose color palette is chosen for high contrast and readability. All text meets accessibility standards for color contrast.
- **Keyboard Navigation:** All interactive elements (input, send button, new chat) are accessible via keyboard.
- **Screen Reader Friendly:** Semantic HTML and ARIA roles can be added for improved screen reader support.

### Extensibility
- **Domain Change:** To change the chatbot's domain (e.g., to finance or education), simply update the system prompt in the API route.
- **Feature Additions:** The UI is modular and can be extended with file uploads, voice input, or more advanced chat features.
- **Model Swapping:** The API route can be adapted to use other LLMs (OpenAI, Anthropic, etc.) with minimal changes.

### Testing and Maintainability
- **Component Isolation:** The ChatBot UI is a single, isolated React component, making it easy to test and maintain.
- **Mockable API:** The API route can be easily mocked for frontend testing, and the UI can be tested independently of the backend.
- **Clear Separation:** UI, API, and configuration are clearly separated for maintainability.

### User Experience
- **Welcoming and Safe:** The welcome message and rose theme create a friendly, non-intimidating environment.
- **Non-Diagnostic Language:** The assistant provides information, not diagnoses, and always encourages users to consult professionals for medical advice.
- **Error Handling:** The UI gracefully handles API errors and informs the user if the assistant cannot answer.

### Deployment
- **Next.js App Router:** The project uses Next.js App Router for modern routing and serverless API routes.
- **Environment Variables:** All secrets and configuration are managed via environment variables for security.
- **Scalability:** The architecture supports deployment to Vercel, AWS, or any platform supporting Next.js serverless functions.

---

This design ensures a clean separation of concerns, secure API usage, and a user-friendly chat experience focused on health questions. 