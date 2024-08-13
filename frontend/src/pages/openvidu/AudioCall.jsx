import React, { useState, useRef } from 'react';
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';

const VideoChat = () => {
    const [session, setSession] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const [sessionId, setSessionId] = useState('');
    const OV = useRef(new OpenVidu());

    const handleSessionIdChange = (e) => {
        setSessionId(e.target.value);
    };

    const joinSession = async () => {
        try {
            let currentSessionId = sessionId; // 상위 스코프의 sessionId를 currentSessionId로 할당

            if (!currentSessionId) {  // sessionId가 비어있다면 새로운 세션 생성
                const sessionResponse = await axios.post('https://i11b210.p.ssafy.io:4443/api/sessions/create');
                currentSessionId = sessionResponse.data;
            }

            const tokenResponse = await axios.post(`https://i11b210.p.ssafy.io:4443/api/sessions/${currentSessionId}/connections`);
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
                publishVideo: true,
                resolution: '640x480',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: false,
            });

            newSession.publish(newPublisher);

            setSession(newSession);
            setPublisher(newPublisher);
            setSessionId(currentSessionId);
        } catch (error) {
            console.error('Error joining session:', error);
            alert('Failed to join session. Please check your network and server.');
        }
    };

    const leaveSession = () => {
        if (session) {
            session.disconnect();
        }
        setSession(null);
        setPublisher(null);
        setSubscribers([]);
        setSessionId('');
    };

    return (
        <div>
            {!session ? (
                <div>
                    <input 
                        type="text" 
                        placeholder="Enter session ID or leave blank for new session" 
                        value={sessionId} 
                        onChange={handleSessionIdChange}
                    />
                    <button onClick={joinSession}>Join Session</button>
                </div>
            ) : (
                <div>
                    <h2>Session ID: {sessionId}</h2>
                    <button onClick={leaveSession}>Leave Session</button>
                </div>
            )}
            {publisher && (
                <div id="publisher">
                    <h3>My Camera</h3>
                    <video autoPlay={true} ref={(video) => video && publisher.addVideoElement(video)} />
                </div>
            )}
            {subscribers.map((sub, i) => (
                <div key={i} id="subscriber">
                    <h3>Participant {i + 1}</h3>
                    <video autoPlay={true} ref={(video) => video && sub.addVideoElement(video)} />
                </div>
            ))}
        </div>
    );
};

export default VideoChat;
