import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const LOCAL_API_BASE = "http://127.0.0.1:5000";
const PROD_API_BASE = "https://sylviawambuu.alwaysdata.net";

const isLocalHost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

const API_BASE =
    process.env.REACT_APP_API_BASE_URL ||
    (isLocalHost ? LOCAL_API_BASE : PROD_API_BASE);

const CHAT_API_URL =
    process.env.REACT_APP_CHAT_API_URL || `${API_BASE}/api/chat`;

const USAGE_API_URL =
    process.env.REACT_APP_USAGE_API_URL || `${API_BASE}/api/usage`;

const isValidUsage = (nextUsage) =>
    nextUsage &&
    typeof nextUsage.used === "number" &&
    typeof nextUsage.limit === "number" &&
    typeof nextUsage.remaining === "number";

const ZeniBot = ({ goals, totalSaved }) => {
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "👋 Welcome to Zeni Finance Assistant.\n\nAsk me about budgeting, saving, goals, or smart financial advice."
        }
    ]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [usage, setUsage] = useState(null);
    const messagesEndRef = useRef(null);

    const applyUsage = (nextUsage) => {
        if (!isValidUsage(nextUsage)) return;
        setUsage(nextUsage);
    };

    // Fetch quota once when chat opens. Backend caches OpenRouter for 5 minutes.
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const response = await axios.get(USAGE_API_URL);
                if (!cancelled) applyUsage(response.data);
            } catch (error) {
                console.error("Usage fetch error:", error);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const addMessage = (sender, text) => {
        setMessages(prev => [...prev, { sender, text }]);
    };

    const processMessage = async () => {
        if (!input.trim() || isSending) return;

        const userMessageText = input;
        addMessage("user", userMessageText);
        setInput("");
        setIsSending(true);

        try {
            const response = await axios.post(CHAT_API_URL, {
                message: userMessageText,
                totalSaved: totalSaved,
                goalsCount: goals ? goals.length : 0
            });

            // Usage comes from backend local cache (bumped after chat) — no extra OpenRouter calls.
            applyUsage(response.data.usage);

            if (response.status === 200 && response.data.reply) {
                addMessage("bot", response.data.reply);
            } else {
                addMessage("bot", "🤖 Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("AI Chat Error:", error);
            applyUsage(error.response?.data?.usage);

            const apiReply = error.response?.data?.reply;
            if (apiReply) {
                addMessage("bot", apiReply);
            } else if (!error.response) {
                addMessage("bot", "❌ Chat backend is offline. Start it with: python backend/app.py");
            } else {
                addMessage("bot", "❌ Couldn't reach the AI brain. Check your OpenRouter key and try again.");
            }
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="zeni-container">
            <div className="zeni-header">
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start" }}>
                    <div>
                        <h2>💰 Zeni Finance Assistant</h2>
                        <p>Smart budgeting & savings guidance</p>
                    </div>
                    {usage && (
                        <div
                            title="OpenRouter free-model daily quota"
                            style={{
                                flexShrink: 0,
                                background: "rgba(28, 176, 246, 0.12)",
                                border: "1px solid rgba(28, 176, 246, 0.35)",
                                borderRadius: "12px",
                                padding: "8px 10px",
                                color: "#9ec9ff",
                                fontSize: "0.7rem",
                                lineHeight: 1.35,
                                textAlign: "right",
                                minWidth: "92px"
                            }}
                        >
                            <div style={{ opacity: 0.8, marginBottom: "2px" }}>Free AI</div>
                            <div><strong style={{ color: "#fff" }}>{usage.remaining}</strong> left</div>
                            <div style={{ opacity: 0.75 }}>{usage.used}/{usage.limit} used</div>
                        </div>
                    )}
                </div>
            </div>

            <div className="zeni-messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={msg.sender === "user" ? "user-message" : "bot-message"}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="zeni-input-area">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Zeni about money..."
                    disabled={isSending}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") processMessage();
                    }}
                />
                <button onClick={processMessage} disabled={isSending}>
                    {isSending ? "..." : "Send"}
                </button>
            </div>
        </div>
    );
};

export default ZeniBot;
