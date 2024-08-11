import React, { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import styles from './Chat.module.css';
import apiClient from '../../api/apiClient';
import sentImage from '../../assets/icons/sent.png'; 
import sentActiveImage from '../../assets/icons/sent-active.png';

const Chat = () => {
    const { roomId } = useParams(); 
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState(null);
    const chatBoxRef = useRef(null);
    const stompClientRef = useRef(null);
    const [sendButtonImage, setSendButtonImage] = useState(sentImage); 

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await apiClient.get('/api/user/my');
                if (response.data && response.data.id) {
                    setUserId(response.data.id);
                }
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };
        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
<<<<<<< HEAD
                const response = await axios.get(`https://i11b210.p.ssafy.io:8443/api/chat/messages/${roomId}`);
=======
                const response = await axios.get(`http://localhost:8080/api/chat/messages/${roomId}`);
>>>>>>> feature/frontend-chatdesign
                if (Array.isArray(response.data)) {
                    setMessages(response.data);
                } else {
                    setMessages([]);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
                setMessages([]);
            }
        };
        fetchMessages();

<<<<<<< HEAD
        // Setup WebSocket connection
        const socket = new SockJS('https://i11b210.p.ssafy.io:8443/ws-stomp');
=======
        const socket = new SockJS('http://localhost:8080/ws-stomp');
>>>>>>> feature/frontend-chatdesign
        const client = Stomp.over(socket);
        if (stompClientRef.current) {
            stompClientRef.current.disconnect();
        }

        client.connect({}, () => {
            stompClientRef.current = client;
            client.subscribe(`/sub/chat/${roomId}`, (msg) => {
                if (msg.body) {
                    const parsedMessage = JSON.parse(msg.body);
                    setMessages(prevMessages => [...prevMessages, parsedMessage]);
                }
            });
        });

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.disconnect();
                stompClientRef.current = null;
            }
        };
    }, [roomId]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        // 메시지가 있으면 활성화 이미지, 없으면 기본 이미지
        setSendButtonImage(message.trim() ? sentActiveImage : sentImage);
    }, [message]);

    const sendMessage = () => {
        if (stompClientRef.current && stompClientRef.current.connected && message.trim() !== '' && userId !== null) {
            const chatMessage = {
                roomId,
                userId,
                message,
                time: new Date().toISOString(),
            };
            stompClientRef.current.send('/pub/chat/message', {}, JSON.stringify(chatMessage));
            setMessage('');
        } else {
            alert("Message or connection issues detected.");
        }
    };

    const shouldShowTime = (currentMessage, previousMessage) => {
        if (!previousMessage) return true;
        const currentTime = dayjs(currentMessage.time);
        const previousTime = dayjs(previousMessage.time);
        return !currentTime.isSame(previousTime, 'minute');
    };

    return (
        <div className={styles['chat-room-container']}>
            <div className={styles['chat-box']} ref={chatBoxRef}>
                {Array.isArray(messages) ? (
                    messages.map((msg, index) => {
                        const previousMessage = messages[index - 1];
                        const showTime = shouldShowTime(msg, previousMessage);

                        return (
                            <div 
                                key={index} 
                                className={`${styles.message} ${msg.userId === userId ? styles['from-user'] : styles['from-other']}`}
                            >
                                <div className={styles['message-content']}>
                                    {msg.message}
                                </div>
                                {showTime && (
                                    <div className={styles['message-time']}>
                                        {dayjs(msg.time).format('HH:mm')}
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p>Loading messages...</p>
                )}
            </div>
            <div className={styles['message-input-container']}>
                <input
                    type="text"
                    className={styles['message-input']}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="메시지를 입력하세요."
                />
                <img 
                    src={sendButtonImage} 
                    alt="Send"
                    className={styles['send-button']}
                    onClick={sendMessage} 
                    style={{ cursor: message.trim() ? 'pointer' : 'not-allowed' }} // 포인터 커서 변경
                />
            </div>
        </div>
    );
};

export default Chat;
