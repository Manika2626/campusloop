"use client";

import { useState } from "react";
import styles from "./Chatbot.module.css";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi! 👋 Ask me anything about announcements — club or teacher.",
    },
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => setOpen(!open);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://chatbot-gemini-two.vercel.app/api/webhook",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            responseId: "123",
            queryResult: {
              queryText: input,
            },
          }),
        }
      );

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      const botMessage = {
        from: "bot",
        text:
          data.fulfillmentText ||
          "🤔 Sorry, I didn’t understand that. Try asking differently.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Fetch error:", err);
      const botMessage = {
        from: "bot",
        text: "⚠️ Sorry, there was an error contacting the server.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderBotMessage = (text) => {
    return text.split("\n").map((line, idx) => {
      const linkMatch = line.match(/\[(.*?)\]\((.*?)\)/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        return (
          <p key={idx}>
            <a href={href} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          </p>
        );
      }
      return <p key={idx} style={{ margin: "2px 0" }}>{line}</p>;
    });
  };

  return (
    <>
      <div className={styles.chatButton} onClick={toggleChat} aria-label="Open Chatbot">
        💬
      </div>

      {open && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>Ask Me Anything</div>

          <div className={styles.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.from === "bot" ? styles.bot : styles.user}
              >
                {m.from === "bot" ? renderBotMessage(m.text) : <p>{m.text}</p>}
              </div>
            ))}
            {loading && (
              <div className={styles.bot}>
                <p>⏳ Thinking…</p>
              </div>
            )}
          </div>

          <div className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              aria-label="Chat input"
            />
            <button onClick={sendMessage} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
