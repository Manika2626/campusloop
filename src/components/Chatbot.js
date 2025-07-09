"use client";

import { useState } from "react";
import styles from "./Chatbot.module.css";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
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

    try {
      const res = await fetch(
        "https://chatbot-webhook-omega.vercel.app/api/webhook",
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
    }
  };

  return (
    <>
      <div className={styles.chatButton} onClick={toggleChat}>
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
                {m.from === "bot" ? (
                  m.text.split("\n").map((line, idx) => (
                    <p key={idx} style={{ margin: "2px 0" }}>
                      {line}
                    </p>
                  ))
                ) : (
                  <p>{m.text}</p>
                )}
              </div>
            ))}
          </div>

          <div className={styles.inputArea}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
