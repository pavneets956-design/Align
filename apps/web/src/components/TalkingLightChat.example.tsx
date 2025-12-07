/**
 * Example usage of TalkingLightChat component
 * 
 * This component is a drop-in chat interface for Talking Light
 * with Osho-style responses.
 */

import TalkingLightChat from './TalkingLightChat';

// Example 1: Basic usage
export function BasicExample() {
  return (
    <div className="h-screen p-6">
      <TalkingLightChat />
    </div>
  );
}

// Example 2: With custom props
export function CustomExample() {
  return (
    <div className="h-screen p-6 bg-gradient-to-b from-purple-50 to-blue-50">
      <TalkingLightChat
        initialMode="divine"
        language="en"
        placeholder="What's on your heart?"
        showModeSelector={true}
        autoRead={false}
        onMessageSent={(message) => {
          console.log('User sent:', message);
        }}
        onResponseReceived={(response) => {
          console.log('AI responded:', response);
        }}
        className="max-w-4xl mx-auto"
      />
    </div>
  );
}

// Example 3: Embedded in a page
export function PageExample() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold">Talking Light</h1>
      </header>
      <main className="container mx-auto p-6">
        <TalkingLightChat
          initialMode="divine"
          showModeSelector={true}
        />
      </main>
    </div>
  );
}

// Example 4: Without mode selector (single mode)
export function SingleModeExample() {
  return (
    <div className="h-screen p-6">
      <TalkingLightChat
        initialMode="divine"
        showModeSelector={false}
        placeholder="Share what's on your heart..."
      />
    </div>
  );
}

