import { OpenVidu } from 'openvidu-browser';
import React, { useState, useRef } from 'react';
import apiClient from '../../api/apiClient';

const AudioCall = () => {
    const [session, setSession] = useState(null);
    const [sessionId, setSessionId] = useState('');
    const [isSessionCreated, setIsSessionCreated] = useState(false);
    const [videoElements, setVideoElements] = useState([]); // 비디오 요소 관리

    const handleSessionIdChange = (event) => {
        setSessionId(event.target.value);
    };

    const initializePublisher = (OV) => {
        return OV.initPublisher(undefined, {
            audioSource: undefined, // 기본 오디오 소스 사용
            videoSource: undefined, // 기본 비디오 소스 사용 (카메라)
            publishAudio: true,     // 오디오 퍼블리시
            publishVideo: true,     // 비디오 퍼블리시
            audioProcessing: {
                noiseSuppression: true,   // 노이즈 억제
                echoCancellation: true,   // 에코 제거
                autoGainControl: true     // 자동 이득 제어
            }
        });
    };

    const createAndJoinSession = async () => {
        const OV = new OpenVidu();
        const session = OV.initSession();
        setSession(session);

        session.on('streamCreated', (event) => {
            const subscriber = session.subscribe(event.stream, undefined);
            const newVideoElement = document.createElement('video');
            newVideoElement.srcObject = event.stream.getMediaStream();
            newVideoElement.autoplay = true;
            newVideoElement.controls = false;
            newVideoElement.playsInline = true;
            setVideoElements((prevElements) => [...prevElements, newVideoElement]); // 새로운 비디오 요소 추가
            console.log('Subscribed to stream:', event.stream);
        });

        try {
            const { data } = await apiClient.post('/api/openvidu/sessions');
            const sessionId = data;
            setSessionId(sessionId);
            setIsSessionCreated(true);
            console.log(`Session ID: ${sessionId}`);

            const tokenResponse = await apiClient.post('/api/openvidu/tokens', sessionId, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });

            const token = tokenResponse.data;
            await session.connect(token);

            const publisher = initializePublisher(OV);

            publisher.once('accessAllowed', () => { 
                console.log('Access to camera and microphone granted');
                session.publish(publisher); 
                const newVideoElement = document.createElement('video');
                newVideoElement.srcObject = publisher.stream.getMediaStream();
                newVideoElement.autoplay = true;
                newVideoElement.controls = false;
                newVideoElement.playsInline = true;
                setVideoElements((prevElements) => [...prevElements, newVideoElement]); // 퍼블리셔의 비디오 요소 추가
                console.log('Published stream:', publisher.stream);
            });

            publisher.once('accessDenied', () => {
                console.error('Access to camera and microphone denied');
            });

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
            const newVideoElement = document.createElement('video');
            newVideoElement.srcObject = event.stream.getMediaStream();
            newVideoElement.autoplay = true;
            newVideoElement.controls = false;
            newVideoElement.playsInline = true;
            setVideoElements((prevElements) => [...prevElements, newVideoElement]); // 새로운 비디오 요소 추가
            console.log('Subscribed to stream:', event.stream);
        });

        try {
            const { data } = await apiClient.post('/api/openvidu/tokens', sessionId, {
                headers: {
                    'Content-Type': 'text/plain',
                },
            });

            const token = data;
            console.log(`Token: ${token}`);
            await session.connect(token);

            const publisher = initializePublisher(OV);

            publisher.once('accessAllowed', () => {
                console.log('Access to camera and microphone granted');
                session.publish(publisher);
                const newVideoElement = document.createElement('video');
                newVideoElement.srcObject = publisher.stream.getMediaStream();
                newVideoElement.autoplay = true;
                newVideoElement.controls = false;
                newVideoElement.playsInline = true;
                setVideoElements((prevElements) => [...prevElements, newVideoElement]); // 퍼블리셔의 비디오 요소 추가
                console.log('Published stream:', publisher.stream);
            });

            publisher.once('accessDenied', () => {
                console.error('Access to camera and microphone denied');
            });

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
                {videoElements.map((videoElement, index) => (
                    <div key={index} ref={(el) => el && el.appendChild(videoElement)} />
                ))}
            </div>
        </div>
    );
};

export default AudioCall;
