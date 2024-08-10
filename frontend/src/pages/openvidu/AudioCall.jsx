import { OpenVidu } from 'openvidu-browser';
import React, { useState, useRef } from 'react';
import apiClient from '../../api/apiClient';

const AudioCall = () => {
    const [session, setSession] = useState(null);
    const [sessionId, setSessionId] = useState('');
    const [isSessionCreated, setIsSessionCreated] = useState(false);
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

    const createAndJoinSession = async () => {
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
                session.publish(publisher); // 퍼블리셔를 접근 권한 부여 후 퍼블리시
                if (videoRef.current && publisher.stream) {
                    videoRef.current.srcObject = publisher.stream.getMediaStream();
                    console.log('Published stream:', publisher.stream);

                    const videoTracks = publisher.stream.getMediaStream().getVideoTracks();
                    if (videoTracks && videoTracks.length > 0) {
                        console.log('Video tracks found:', videoTracks);
                    } else {
                        console.error('No video tracks available in the stream');
                    }
                } else {
                    console.error('Publisher stream is not available');
                }
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
            if (videoRef.current) {
                videoRef.current.srcObject = event.stream.getMediaStream();
                console.log('Subscribed to stream:', event.stream);
            }
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
                session.publish(publisher); // 퍼블리셔를 접근 권한 부여 후 퍼블리시
                if (videoRef.current && publisher.stream) {
                    videoRef.current.srcObject = publisher.stream.getMediaStream();
                    console.log('Published stream:', publisher.stream);

                    const videoTracks = publisher.stream.getMediaStream().getVideoTracks();
                    if (videoTracks && videoTracks.length > 0) {
                        console.log('Video tracks found:', videoTracks);
                    } else {
                        console.error('No video tracks available in the stream');
                    }
                } else {
                    console.error('Publisher stream is not available');
                }
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
                <video ref={videoRef} autoPlay playsInline controls={false} style={{ width: '100%', height: 'auto', backgroundColor: 'black' }} />
            </div>
        </div>
    );
};

export default AudioCall;
