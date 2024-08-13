import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import styles from './Chat.module.css';
import sentImage from '../../assets/icons/sent.png'; 
import sentActiveImage from '../../assets/icons/sent-active.png';
import loadingSpinner from '../../assets/icons/loading-spinner.gif';

const Chat = () => {
    const { roomId } = useParams(); 
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [userId, setUserId] = useState(null);
    const [inCall, setInCall] = useState(false);
    const [loading, setLoading] = useState(false);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const [incomingCall, setIncomingCall] = useState(false); // 통화 요청 상태
    const [callerSessionId, setCallerSessionId] = useState(null); // 요청 세션 ID
    const OV = useRef(new OpenVidu());
    const stompClientRef = useRef(null);
    const sessionRef = useRef(null);
    const chatBoxRef = useRef(null);
    const [sendButtonImage, setSendButtonImage] = useState(sentImage);

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
                    // 통화 요청 수신
                    setIncomingCall(true);
                    setCallerSessionId(parsedMessage.sessionId);
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
            leaveSession();
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

    const handleCallButtonClick = async () => {
        setLoading(true); // 로딩 상태 시작
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
            setLoading(false); // 로딩 상태 종료
        } catch (error) {
            console.error('Error joining session:', error);
            alert('Failed to join session. Please check your network and server.');
            setLoading(false); // 로딩 상태 종료
        }
    };

    const handleCallAccept = async () => {
        setLoading(true); // 로딩 상태 시작
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
        setIncomingCall(false); // 통화 요청 상태 초기화
        setLoading(false); // 로딩 상태 종료
    };

    const handleCallReject = () => {
        // 통화 요청 거절 처리
        setIncomingCall(false);
        setCallerSessionId(null);
    };

    const sendMessage = () => {
        if (stompClientRef.current && stompClientRef.current.connected && message.trim() !== '' && userId !== null) {
            const chatMessage = {
                roomId,
                userId,
                message,
                time: new Date().toISOString(),
            };
            stompClientRef.current.send(`/pub/chat/${roomId}`, {}, JSON.stringify(chatMessage));
            setMessage('');
        } else {
            alert("Message or connection issues detected.");
        }
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
                <img 
                    src={sendButtonImage} 
                    alt="Send"
                    className={styles['send-button']}
                    onClick={sendMessage} 
                    style={{ cursor: message.trim() ? 'pointer' : 'not-allowed' }} 
                />
                {loading ? (
                    <img src={loadingSpinner} alt="Loading" className={styles['loading-spinner']} />
                ) : (
                    <button onClick={handleCallButtonClick} className={styles['call-button']}>통화</button>
                )}
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
