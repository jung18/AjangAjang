import { OpenVidu } from 'openvidu-browser';
import React, { useState, useRef } from 'react';
import apiClient from '../../api/apiClient';

const AudioCall = () => {
    const [session, setSession] = useState(null);
    const [sessionId, setSessionId] = useState('');
    const [isSessionCreated, setIsSessionCreated] = useState(false);
    const videoRef = useRef(null); // 비디오 요소에 대한 참조

    const handleSessionIdChange = (event) => {
        setSessionId(event.target.value);
    };

    const createAndJoinSession = async () => {
        const OV = new OpenVidu();
        const session = OV.initSession();
        setSession(session);

        session.on('streamCreated', (event) => {
            const subscriber = session.subscribe(event.stream, undefined);
            if (videoRef.current) {
                videoRef.current.srcObject = event.stream.getMediaStream();
            }
        });

        try {
            // 서버에 세션 생성 요청
            const { data } = await apiClient.post('/api/openvidu/sessions');
            const sessionId = data;
            setSessionId(sessionId);
            setIsSessionCreated(true);
            console.log(`Session ID: ${sessionId}`);

            // 서버에 토큰 요청
            const tokenResponse = await apiClient.post('/api/openvidu/tokens', sessionId, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });

            const token = tokenResponse.data;

            // 세션에 접속
            await session.connect(token);

            // 자신의 오디오 및 비디오 퍼블리시
            const publisher = OV.initPublisher(videoRef.current, {
                audioSource: undefined, // 기본 오디오 소스 사용
                videoSource: undefined, // 기본 비디오 소스 사용 (카메라)
                publishAudio: true,     // 오디오 퍼블리시
                publishVideo: true,     // 비디오 퍼블리시
            });

            session.publish(publisher);
        } catch (error) {
            console.error('There was an error creating or connecting to the session:', error.message);
        }
    };

    const joinExistingSession = async () => {
        const OV = new OpenVidu();
        const session = OV.initSession();
        setSession(session);

        session.on('streamCreated', (event) => {
            const subscriber = session.subscribe(event.stream, undefined);
            if (videoRef.current) {
                videoRef.current.srcObject = event.stream.getMediaStream();
            }
        });

        try {
            // 서버에 해당 sessionId에 대한 token 요청
            const { data } = await apiClient.post('/api/openvidu/tokens', sessionId, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });

            const token = data;
            console.log(`Token: ${token}`);

            // 세션에 접속
            await session.connect(token);

            // 자신의 오디오 및 비디오 퍼블리시
            const publisher = OV.initPublisher(videoRef.current, {
                audioSource: undefined, // 기본 오디오 소스 사용
                videoSource: undefined, // 기본 비디오 소스 사용 (카메라)
                publishAudio: true,     // 오디오 퍼블리시
                publishVideo: true,     // 비디오 퍼블리시
            });

            session.publish(publisher);
        } catch (error) {
            console.error('There was an error connecting to the session:', error.message);
        }
    };

    return (
        <div>
            {!isSessionCreated ? (
                <div>
                    <button onClick={createAndJoinSession}>Create and Join Session</button>
                </div>
            ) : (
                <div>
                    <p>Session created! Share this ID with others: {sessionId}</p>
                    <input
                        type="text"
                        value={sessionId}
                        onChange={handleSessionIdChange}
                        placeholder="Enter Session ID"
                    />
                    <button onClick={joinExistingSession}>Join Existing Session</button>
                </div>
            )}

            {/* 비디오 요소 렌더링 */}
            <div>
                <video ref={videoRef} autoPlay playsInline controls={false} style={{ width: '100%', height: 'auto', backgroundColor: 'black' }} />
            </div>
        </div>
    );
};

export default AudioCall;
