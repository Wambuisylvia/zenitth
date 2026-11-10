import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ZeniBot = ({ goals, totalSaved }) => {
    const [messages, setMessages] = useState([
        {
            sender: "bot",
            text: "👋 Welcome to Zeni Finance Assistant.\n\nAsk me about budgeting, saving, goals, or smart financial advice."
        }
    ]);

    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const addMessage = (sender, text) => {
        setMessages(prev => [...prev, { sender, text }]);
    };

    const processMessage = async () => {
        if (!input.trim()) return;

        const userMessageText = input;
        addMessage("user", userMessageText);
        setInput("");

        try {
            // Send user message and live metrics to Flask backend
            const response = await axios.post("http://127.0.0.1:5000/api/chat", {
                message: userMessageText,
                totalSaved: totalSaved,
                goalsCount: goals ? goals.length : 0
            });

            if (response.status === 200 && response.data.reply) {
                addMessage("bot", response.data.reply);
            } else {
                addMessage("bot", "🤖 Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("AI Chat Error:", error);
            addMessage("bot", "❌ Connected to server, but couldn't reach the AI brain.");
        }
    };

    return (
        <div className="zeni-container">
            <div className="zeni-header">
                <h2>💰 Zeni Finance Assistant</h2>
                <p>Smart budgeting & savings guidance</p>
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
                    onKeyDown={(e) => {
                        if (e.key === "Enter") processMessage();
                    }}
                />
                <button onClick={processMessage}>Send</button>
            </div>
        </div>
    );
};

export default ZeniBot;