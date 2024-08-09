import React, { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import './Chat.css';
import apiClient from '../../api/apiClient';

const Chat = () => {
    const roomId = 1; // Hardcoded roomId
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [userId, setUserId] = useState(null);
    const chatBoxRef = useRef(null);

    // Fetch userId from the backend using the access token
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const accessToken = sessionStorage.getItem('token-storage');
                if (!accessToken) {
                    console.error('No access token found in session storage');
                    return;
                }

                const response = await apiClient.get('/api/user/my');

                if (response.data && response.data.id) {
                    setUserId(response.data.id);
                } else {
                    console.error('Invalid response from /api/user/my:', response.data);
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchUserId();
    }, []);

    // Fetch messages and setup WebSocket connection when component mounts
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`https://i11b210.p.ssafy.io:4443/api/chat/messages/${roomId}`);
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
        const socket = new SockJS('https://i11b210.p.ssafy.io:4443/ws-stomp');
        const client = Stomp.over(socket);
        client.connect({}, () => {
            setStompClient(client);
            client.subscribe(`/sub/chat/${roomId}`, (msg) => {
                if (msg.body) {
                    const parsedMessage = JSON.parse(msg.body);
                    setMessages(prevMessages => [...prevMessages, parsedMessage]);
                }
            });
        });

        return () => {
            if (client) client.disconnect();
        };
    }, [roomId]);

    // Scroll to the bottom of the chat box when messages change
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = () => {
        if (stompClient && stompClient.connected && message.trim() !== '' && userId !== null) {
            const chatMessage = {
                roomId,
                userId,
                message,
                time: new Date().toISOString(),
            };

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
                    value={userId !== null ? userId : 'Loading...'}
                    readOnly
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
