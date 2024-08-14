import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import styles from './Chat.module.css';

const Chat = () => {
    const { roomId } = useParams(); 
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState(null);
    const chatBoxRef = useRef(null);
    const stompClientRef = useRef(null);
    const OV = useRef(new OpenVidu());
    const [session, setSession] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get('/api/user/my');
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

    const handleCallButtonClick = async () => {
        try {
            const sessionResponse = await axios.post(`https://i11b210.p.ssafy.io:4443/api/sessions/create`);
            const newSessionId = sessionResponse.data;
            
            const message = {
                sessionId: newSessionId,
                type: 'CALL_REQUEST',
            };
            stompClientRef.current.send(`/pub/chat/${roomId}`, {}, JSON.stringify(message));

            const tokenResponse = await axios.post(`https://i11b210.p.ssafy.io:4443/api/sessions/${newSessionId}/connections`);
            const token = tokenResponse.data;

            let newSession = OV.current.initSession();

            newSession.on('streamCreated', (event) => {
                const subscriber = newSession.subscribe(event.stream, 'subscriber');
                setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
            });

            newSession.on('streamDestroyed', (event) => {
                setSubscribers((prevSubscribers) =>
                    prevSubscribers.filter((sub) => sub !== event.stream.streamManager)
                );
            });

            await newSession.connect(token);

            let newPublisher = await OV.current.initPublisherAsync(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: false,
            });

            newSession.publish(newPublisher);

            setSession(newSession);
            setPublisher(newPublisher);
        } catch (error) {
            console.error('Error joining session:', error);
            alert('Failed to join session. Please check your network and server.');
        }
    };

    const handleCallAccept = async (sessionId) => {
        navigate(`/audio-call/${sessionId}`);
    };

    const leaveSession = () => {
        if (session) {
            session.disconnect();
        }
        setSession(null);
        setPublisher(null);
        setSubscribers([]);
    };

    return (
        <div className={styles['chat-room-container']}>
            <div className={styles['chat-box']} ref={chatBoxRef}>
                {Array.isArray(messages) ? (
                    messages.map((msg, index) => (
                        <div key={index} className={`${styles.message} ${msg.userId === userId ? styles['from-user'] : styles['from-other']}`}>
                            <div className={styles['message-content']}>{msg.message}</div>
                        </div>
                    ))
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
                <button onClick={handleCallButtonClick} className={styles['call-button']}>통화</button>
            </div>
        </div>
    );
};

export default Chat;
