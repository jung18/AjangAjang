import { OpenVidu } from 'openvidu-browser';
import React, { useState, useRef } from 'react';
import apiClient from '../../api/apiClient';

const AudioCall = () => {
    const [session, setSession] = useState(null);
    const [sessionId, setSessionId] = useState('');
    const videoRef = useRef(null);

    const handleSessionIdChange = (event) => {
        setSessionId(event.target.value);
    };

    const initializePublisher = (OV) => {
        return OV.initPublisher(videoRef.current, {
            audioSource: undefined, // 기본 오디오 소스 사용
            videoSource: undefined, // 기본 비디오 소스 사용 (카메라)
            publishAudio: true,     // 오디오 퍼블리시
            publishVideo: true,     // 비디오 퍼블리시
        });
    };

    const createSession = async () => {
        try {
            const OV = new OpenVidu();
            const session = OV.initSession();
            setSession(session);

            session.on('streamCreated', (event) => {
                const subscriber = session.subscribe(event.stream, undefined);
                if (videoRef.current) {
                    videoRef.current.srcObject = event.stream.getMediaStream();
                    console.log('Subscribed to stream:', event.stream);
                }
            });

            const { data } = await apiClient.post('/api/openvidu/sessions');
            const newSessionId = data;
            setSessionId(newSessionId);
            console.log(`Session ID created: ${newSessionId}`);

        } catch (error) {
            console.error('There was an error creating the session:', error.message);
        }
    };

    const joinSession = async () => {
        try {
            if (!sessionId) {
                console.error('Session ID is required to join a session.');
                return;
            }

            const OV = new OpenVidu();
            const session = OV.initSession();
            setSession(session);

            session.on('streamCreated', (event) => {
                const subscriber = session.subscribe(event.stream, undefined);
                if (videoRef.current) {
                    videoRef.current.srcObject = event.stream.getMediaStream();
                    console.log('Subscribed to stream:', event.stream);
                }
            });

            // 세션 ID를 사용하여 토큰을 발급받음
            const tokenResponse = await apiClient.post('/api/openvidu/tokens', sessionId, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });

            if (tokenResponse.status !== 200) {
                console.error(`Error joining session: ${tokenResponse.data}`);
                return;
            }

            const token = tokenResponse.data;
            console.log(`Token: ${token}`);
            await session.connect(token);

            const publisher = initializePublisher(OV);

            publisher.once('accessAllowed', () => {
                console.log('Access to camera and microphone granted');
                session.publish(publisher);

                if (videoRef.current && publisher.stream) {
                    videoRef.current.srcObject = publisher.stream.getMediaStream();
                    console.log('Published stream:', publisher.stream);
                } else {
                    console.error('Publisher stream is not available');
                }
            });

            publisher.once('accessDenied', () => {
                console.error('Access to camera and microphone denied');
            });

        } catch (error) {
            console.error('There was an error joining the session:', error.message);
        }
    };

    return (
        <div>
            <div>
                <button onClick={createSession}>Create Session</button>
                <button onClick={joinSession}>Join Session</button>
            </div>
            <div>
                <input
                    type="text"
                    value={sessionId}
                    onChange={handleSessionIdChange}
                    placeholder="Enter Session ID"
                />
            </div>
            {/* 비디오 요소 렌더링 */}
            <div>
                <video ref={videoRef} autoPlay playsInline controls={false} style={{ width: '100%', height: 'auto', backgroundColor: 'black' }} />
            </div>
        </div>
    );
};

export default AudioCall;
