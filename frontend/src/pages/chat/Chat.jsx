import React, { useState, useEffect, useRef } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 
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
    const navigate = useNavigate(); 

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
                const response = await axios.get(`https://i11b210.p.ssafy.io:4443/api/chat/messages/${roomId}`);
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

        const socket = new SockJS('https://i11b210.p.ssafy.io:4443/ws-stomp');
        const client = Stomp.over(socket);
        if (stompClientRef.current) {
            stompClientRef.current.disconnect();
        }

        client.connect({}, () => {
            stompClientRef.current = client;
            client.subscribe(`/sub/chat/${roomId}`, (msg) => {
                const parsedMessage = JSON.parse(msg.body);
                if (parsedMessage.type === 'CALL_REQUEST' && parsedMessage.sessionId) {
                    console.log('거는 쪽 Session ID:', parsedMessage.sessionId);
                    if (window.confirm('통화 요청이 있습니다. 수락하시겠습니까?')) {
                        handleCallAccept(parsedMessage.sessionId);
                    }
                } else {
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
        setSendButtonImage(message.trim() ? sentActiveImage : sentImage);
    }, [message]);

    const createSession = async () => {
        try {
            const response = await apiClient.post('/api/call/session', { roomId });
            console.log('생성된 Session ID:', response.data.sessionId);
            return response.data.sessionId; // 생성된 세션 ID 반환
        } catch (error) {
            console.error('Error creating session:', error);
            return null;
        }
    };

    const handleCallButtonClick = async () => {
        const sessionId = await createSession();
        if (sessionId) {
            const callMessage = {
                roomId,
                userId,
                sessionId,
                type: 'CALL_REQUEST',
                time: new Date().toISOString(),
            };
            stompClientRef.current.send('/pub/chat/call', {}, JSON.stringify(callMessage));
            // 세션 ID를 전달하며 VideoChat 페이지로 이동
            navigate(`/audio-call/${sessionId}`); 
        } else {
            alert('통화 세션 생성에 실패했습니다.');
        }
    };

    const handleCallAccept = async (sessionId) => {
        // 수락 시에도 세션 ID를 전달하며 VideoChat 페이지로 이동
        navigate(`/audio-call/${sessionId}`); 
    };

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
                    style={{ cursor: message.trim() ? 'pointer' : 'not-allowed' }} 
                />
                <button 
                    className={styles['call-button']}
                    onClick={handleCallButtonClick}
                >
                    통화
                </button>
            </div>
        </div>
    );
};

export default Chat;
