import {
  useState,
  useEffect,
  useRef
} from "react";

import {
  askAI
} from "../api/aiChatApi";

export default function AIChatModal({
  isOpen,
  onClose
}) {

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState([]);

  const bottomRef =
    useRef();

  // Load history

  useEffect(() => {

    const saved =
      localStorage.getItem(
        "ai_chat_history"
      );

    if (saved) {

      setMessages(
        JSON.parse(saved)
      );
    }

  }, []);

  // Save history

  useEffect(() => {

    localStorage.setItem(
      "ai_chat_history",
      JSON.stringify(messages)
    );

  }, [messages]);

  // Auto scroll

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [messages]);

  if (!isOpen) return null;

const sendMessage = async () => {

    if (!message.trim()) return;

    const currentMessage = message;

    setMessages(prev => [
        ...prev,
        {
            sender: "user",
            text: currentMessage
        }
    ]);

    setMessage("");

    try {

        setLoading(true);

        const response = await askAI(currentMessage);

        console.log("AI Response:", response);

        setMessages(prev => [
            ...prev,
            {
                sender: "ai",
                text: response.message || "No response"
            }
        ]);

    } catch (err) {

        console.error(err);

        setMessages(prev => [
            ...prev,
            {
                sender: "ai",
                text: "Unable to connect to AI Assistant."
            }
        ]);

    } finally {

        setLoading(false);

    }
};


  const handleKeyDown =
    (e) => {

      if (
        e.key === "Enter" &&
        !e.shiftKey
      ) {

        e.preventDefault();

        sendMessage();
      }
    };

  return (

    <div
      className="
      fixed inset-0
      bg-black/70
      backdrop-blur-md
      z-[999]
      flex
      items-center
      justify-center
      p-4
      "
    >

     <div
        className="
        w-full
        max-w-5xl

        h-[85vh]

        bg-slate-900/95
        backdrop-blur-3xl

        border
        border-blue-500/20

        rounded-[32px]

        shadow-[0_0_80px_rgba(59,130,246,0.15)]

        flex
        flex-col

        overflow-hidden
        "
        >

        {/* HEADER */}

        <div
  className="
  px-6
  py-5

  border-b
  border-slate-800

  flex
  justify-between
  items-center
  "
>

  <div
    className="
    flex
    items-center
    gap-4
    "
  >

    <div
      className="
      w-12
      h-12

      rounded-2xl

      bg-gradient-to-br
      from-blue-500
      via-indigo-500
      to-purple-500

      flex
      items-center
      justify-center

      text-2xl

      shadow-lg
      shadow-blue-500/30
      "
    >
      🤖
    </div>

    <div>

      <h2
        className="
        text-xl
        font-bold

        bg-gradient-to-r
        from-blue-400
        via-indigo-400
        to-purple-400

        bg-clip-text
        text-transparent
        "
      >
        AI Financial Assistant
      </h2>

      <p
        className="
        text-xs
        text-slate-400
        "
      >
        Powered by FinSight Intelligence
      </p>

    </div>

  </div>

  <button
    onClick={onClose}
    className="
    text-red-400

    text-2xl

    hover:scale-110

    transition-all
    "
  >
    ✕
  </button>

</div>

        {/* CHAT AREA */}

<div
  className="
  flex-1
  overflow-y-auto
  p-6
  space-y-5
  "
>

  {messages.length === 0 && (

    <div
      className="
      flex
      flex-col
      items-center
      justify-center

      h-full

      text-center
      "
    >

      <div
        className="
        w-24
        h-24

        rounded-full

        bg-gradient-to-br
        from-blue-500/20
        to-purple-500/20

        border
        border-blue-500/20

        flex
        items-center
        justify-center

        text-5xl

        shadow-lg
        shadow-blue-500/20

        animate-pulse
        "
      >
        🤖
      </div>

      <h3
        className="
        mt-6

        text-3xl
        font-bold

        bg-gradient-to-r
        from-blue-400
        via-indigo-400
        to-purple-400

        bg-clip-text
        text-transparent
        "
      >
        Welcome to FinSight AI
      </h3>

      <p
        className="
        mt-3

        text-slate-400

        max-w-lg
        "
      >
        Your personal financial assistant.
        Ask about expenses, savings,
        investments, budgets and
        financial planning.
      </p>

      <div
        className="
        flex
        flex-wrap
        justify-center

        gap-3

        mt-8
        "
      >

        {[
          "Analyze my expenses",
          "Create a monthly budget",
          "How can I save money?",
          "Investment tips",
          "Reduce spending"
        ].map((item) => (

          <button
            key={item}
            onClick={() =>
              setMessage(item)
            }
            className="
            px-4
            py-2

            rounded-full

            bg-slate-800

            border
            border-slate-700

            text-slate-300

            hover:text-white
            hover:border-blue-500

            hover:scale-105

            transition-all
            duration-300
            "
          >
            {item}
          </button>

        ))}

      </div>

    </div>

  )}

  {messages.map((msg, index) => (

    <div
      key={index}
      className={`
        flex
        ${
          msg.sender === "user"
            ? "justify-end"
            : "justify-start"
        }
      `}
    >

      {msg.sender === "ai" ? (

        <div
          className="
          max-w-[80%]

          bg-slate-800/90

          border
          border-slate-700

          rounded-[24px]

          px-5
          py-4

          shadow-lg

          text-slate-200

          whitespace-pre-wrap
          "
        >

          <div
            className="
            text-xs

            text-blue-400

            mb-2

            font-semibold
            "
          >
            🤖 FinSight AI
          </div>

          {msg.text}

        </div>

      ) : (

        <div
          className="
          max-w-[80%]

          bg-gradient-to-r
          from-blue-600
          via-indigo-600
          to-purple-600

          rounded-[24px]

          px-5
          py-4

          shadow-lg
          shadow-blue-500/20

          text-white

          whitespace-pre-wrap
          "
        >
          {msg.text}
        </div>

      )}

    </div>

  ))}

  {loading && (

    <div
      className="
      flex
      justify-start
      "
    >

<div
  className="
  bg-slate-800

  px-4
  py-3

  rounded-2xl

  border
  border-slate-700

  text-slate-300
  text-sm

  flex
  items-center
  gap-2

  w-fit
  "
>
  🤖 Thinking...

  <span className="animate-pulse">.</span>
  <span className="animate-pulse [animation-delay:0.2s]">.</span>
  <span className="animate-pulse [animation-delay:0.4s]">.</span>
</div>

    </div>

  )}

  <div ref={bottomRef} />

</div>

        {/* INPUT */}
<div
  className="
  border-t
  border-slate-800

  px-4
  py-3

  bg-slate-900/80
  backdrop-blur-xl
  "
>

  <div
    className="
    flex
    items-center
    gap-3

    bg-slate-800/70

    border
    border-slate-700

    rounded-2xl

    px-3
    py-2

    focus-within:border-blue-500
    focus-within:shadow-lg
    focus-within:shadow-blue-500/10

    transition-all
    "
  >

    <textarea
      value={message}
      onChange={(e) =>
        setMessage(e.target.value)
      }
      onKeyDown={handleKeyDown}
      placeholder="Ask FinSight AI..."
      rows={1}
      className="
      flex-1

      bg-transparent

      text-white

      placeholder:text-slate-500

      resize-none

      outline-none

      py-2

      max-h-[100px]
      "
    />

    <button
      onClick={sendMessage}
      disabled={loading}
      className="
      w-11
      h-11

      flex
      items-center
      justify-center

      rounded-xl

      bg-gradient-to-r
      from-blue-600
      via-indigo-600
      to-purple-600

      text-white
      text-lg

      hover:scale-105
      hover:shadow-lg
      hover:shadow-blue-500/20

      active:scale-95

      transition-all
      duration-300
      "
    >
      ➜
    </button>

  </div>

</div>
      </div>

    </div>
  );
}