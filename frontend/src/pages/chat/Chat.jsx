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
        if (userId) { // userId가 설정된 후에만 WebSocket 연결을 설정합니다.
            const fetchMessages = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/chat/messages/${roomId}`);
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

            const socket = new SockJS('http://localhost:8080/ws-stomp');
            const client = Stomp.over(socket);

            if (stompClientRef.current && stompClientRef.current.connected) {
                return; // 이미 연결되어 있으면 새로운 연결을 만들지 않음
            }

            client.connect(
                {
                    userId: userId.toString(), // STOMP 연결 시 헤더로 userId 전달
                    roomId: roomId.toString()  // STOMP 연결 시 헤더로 roomId 전달
                },
                () => {
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
                }
            );

            return () => {
                if (stompClientRef.current) {
                    // 연결을 종료할 때 필요한 정보를 헤더에 추가하여 서버로 전송
                    stompClientRef.current.disconnect(() => {
                        console.log("Disconnected from WebSocket");
                    }, {
                        userId: userId.toString(),
                        roomId: roomId.toString()
                    });
                    stompClientRef.current = null;
                }
            };
        }
    }, [roomId, userId]);

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
            return response.data.sessionId;
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
                time: new Date(new Date().getTime() + (9 * 60 * 60 * 1000)).toISOString(),
            };
            stompClientRef.current.send('/pub/chat/call', {}, JSON.stringify(callMessage));
            navigate(`/audio-call/${sessionId}`); 
        } else {
            alert('통화 세션 생성에 실패했습니다.');
        }
    };

    const handleCallAccept = (sessionId) => {
        navigate(`/audio-call/${sessionId}`); 
    };

    const sendMessage = () => {
        if (!stompClientRef.current || !stompClientRef.current.connected) {
            alert("WebSocket connection is not established.");
            return;
        }
        if (message.trim() === '') {
            alert("Message cannot be empty.");
            return;
        }
        if (userId === null) {
            alert("User ID is not available.");
            return;
        }

        const chatMessage = {
            roomId,
            userId,
            message,
            time: new Date(new Date().getTime() + (9 * 60 * 60 * 1000)).toISOString(),
        };
        console.log(new Date(new Date().getTime() + (9 * 60 * 60 * 1000)).toISOString());
        stompClientRef.current.send('/pub/chat/message', {}, JSON.stringify(chatMessage));
        setMessage('');
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
