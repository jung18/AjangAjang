import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
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
    const [inCall, setInCall] = useState(false);
    const [loading, setLoading] = useState(false);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const [incomingCall, setIncomingCall] = useState(false);
    const [callerSessionId, setCallerSessionId] = useState(null);
    const OV = useRef(new OpenVidu());
    const stompClientRef = useRef(null);
    const [sendButtonImage, setSendButtonImage] = useState(sentImage); 
    const navigate = useNavigate(); 
    const sessionRef = useRef(null);
    const chatBoxRef = useRef(null);

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
        if (userId) {
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

            if (stompClientRef.current && stompClientRef.current.connected) {
                return;
            }

            client.connect(
                {
                    userId: userId.toString(),
                    roomId: roomId.toString(),
                },
                () => {
                    stompClientRef.current = client;
                    client.subscribe(`/sub/chat/${roomId}`, (msg) => {
                        const parsedMessage = JSON.parse(msg.body);
                        if (parsedMessage.type === 'CALL_REQUEST' && parsedMessage.sessionId) {
                            setIncomingCall(true);
                            setCallerSessionId(parsedMessage.sessionId);
                        } else {
                            setMessages(prevMessages => [...prevMessages, parsedMessage]);
                        }
                    });
                },
                (error) => {
                    console.error('Error connecting to WebSocket:', error);
                }
            );

            return () => {
                if (stompClientRef.current) {
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
        setLoading(true);
        try {
            const sessionId = await createSession();
            if (sessionId) {
                const callMessage = {
                    sessionId,
                    type: 'CALL_REQUEST',
                };
                stompClientRef.current.send(`/pub/chat/${roomId}`, {}, JSON.stringify(callMessage));

                const tokenResponse = await axios.post(`https://i11b210.p.ssafy.io:4443/api/sessions/${sessionId}/connections`);
                const token = tokenResponse.data;

                let newSession = OV.current.initSession();
                sessionRef.current = newSession;

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

                setInCall(true);
                setPublisher(newPublisher);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error joining session:', error);
            alert('Failed to join session. Please check your network and server.');
            setLoading(false);
        }
    };

    const handleCallAccept = async () => {
        setLoading(true);
        try {
            const tokenResponse = await axios.post(`https://i11b210.p.ssafy.io:4443/api/sessions/${callerSessionId}/connections`);
            const token = tokenResponse.data;

            let newSession = OV.current.initSession();
            sessionRef.current = newSession;

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

            setInCall(true);
            setPublisher(newPublisher);
            setIncomingCall(false);
        } catch (error) {
            console.error('Error accepting call:', error);
            alert('Failed to accept call. Please check your network and server.');
        }
        setLoading(false);
    };

    const handleCallReject = () => {
        setIncomingCall(false);
        setCallerSessionId(null);
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
        stompClientRef.current.send('/pub/chat/message', {}, JSON.stringify(chatMessage));
        setMessage('');
    };

    const shouldShowTime = (currentMessage, previousMessage) => {
        if (!previousMessage) return true;
        const currentTime = dayjs(currentMessage.time);
        const previousTime = dayjs(previousMessage.time);
        return !currentTime.isSame(previousTime, 'minute');
    };

    const leaveSession = () => {
        if (sessionRef.current) {
            sessionRef.current.disconnect();
        }
        setPublisher(null);
        setSubscribers([]);
        setInCall(false);
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

            {inCall && (
                <div className={styles['call-container']}>
                    <h3>통화 중...</h3>
                    {publisher && (
                        <div id="publisher">
                            <audio autoPlay={true} ref={(audio) => audio && publisher.addAudioElement(audio)} />
                        </div>
                    )}
                    {subscribers.map((sub, i) => (
                        <div key={i} id="subscriber">
                            <audio autoPlay={true} ref={(audio) => audio && sub.addAudioElement(audio)} />
                        </div>
                    ))}
                    <button onClick={leaveSession} className={styles['end-call-button']}>통화 종료</button>
                </div>
            )}

            {incomingCall && (
                <div className={styles['incoming-call-container']}>
                    <h3>통화 요청이 있습니다.</h3>
                    <button onClick={handleCallAccept} className={styles['accept-call-button']}>수락</button>
                    <button onClick={handleCallReject} className={styles['reject-call-button']}>거절</button>
                </div>
            )}
        </div>
    );
};

export default Chat;
