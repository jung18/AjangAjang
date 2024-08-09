import React, { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import './Chat.css';

const Chat = () => {
    const roomId = 1; // Hardcoded roomId
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const chatBoxRef = useRef(null);
    const userId = 1; // Hardcoded userId

    // Fetch messages when the component mounts
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/chat/messages/1`);
                console.log(response.data);
                if (Array.isArray(response.data)) {
                    setMessages(response.data);
                } else {
                    console.error('Fetched messages are not an array:', response.data);
                    setMessages([]);
                }
                // Scroll to the bottom of the chat box
                setTimeout(() => {
                    if (chatBoxRef.current) {
                        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
                    }
                }, 100);
            } catch (error) {
                console.error('Error fetching messages:', error);
                setMessages([]);
            }
        };

        fetchMessages();

        // Setup WebSocket connection
        const socket = new SockJS('http://localhost:8080/ws-stomp');
        const client = Stomp.over(socket);
        client.connect({}, () => {
            setStompClient(client);
            client.subscribe(`/sub/chat/${roomId}`, (msg) => {
                if (msg.body) {
                    const parsedMessage = JSON.parse(msg.body);
                    console.log("Received message:", parsedMessage); // Debugging line
                    setMessages(prevMessages => [...prevMessages, parsedMessage]);
                }
            });
        });

        return () => {
            if (client) client.disconnect();
        };
    }, [roomId]); // Only re-run this effect when roomId changes

    // Scroll to the bottom of the chat box when messages change
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = () => {
        if (stompClient && stompClient.connected && message.trim() !== '') {
            const chatMessage = {
                roomId: 1, // Hardcoded roomId
                userId: 1, // Hardcoded userId
                message,
                time: new Date().toISOString(),
            };

            console.log("Sending chat message:", chatMessage); // Debugging line
            stompClient.send('/pub/chat/message', {}, JSON.stringify(chatMessage));
            setMessage('');
        } else {
            alert("Message or connection issues detected.");
        }
    };

    return (
        <div className="chat-room-container">
            <h1>Room {roomId}</h1>
            <div className="username-input">
                <input
                    type="text"
                    value={userId}
                    readOnly
                    placeholder="User ID (1)"
                />
            </div>
            <div className="chat-box" ref={chatBoxRef}>
                {Array.isArray(messages) ? (
                    messages.map((msg, index) => (
                        <div key={index} className="message">
                            <strong>{msg.userId}</strong>: {msg.message}
                        </div>
                    ))
                ) : (
                    <p>Loading messages...</p>
                )}
            </div>
            <div className="message-input">
                <input
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Enter your message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
