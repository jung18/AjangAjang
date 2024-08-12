import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';

const AudioCall = () => {
    const { sessionId } = useParams();
    const [session, setSession] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const OV = useRef(new OpenVidu());

    useEffect(() => {
        const joinSession = async () => {
            try {
                const tokenResponse = await axios.post(`/api/sessions/${sessionId}/connections`);
                const token = tokenResponse.data;

                const newSession = OV.current.initSession();

                newSession.on('streamCreated', (event) => {
                    const subscriber = newSession.subscribe(event.stream, undefined);
                    setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
                });

                newSession.on('streamDestroyed', (event) => {
                    setSubscribers((prevSubscribers) =>
                        prevSubscribers.filter((sub) => sub !== event.stream.streamManager)
                    );
                });

                await newSession.connect(token);

                const newPublisher = await OV.current.initPublisherAsync(undefined, {
                    audioSource: true, 
                    videoSource: false,
                    publishAudio: true,
                    publishVideo: false,
                    resolution: '640x480',
                    frameRate: 30,
                    insertMode: 'APPEND',
                    mirror: false,
                });

                newSession.publish(newPublisher);

                setSession(newSession);
                setPublisher(newPublisher);
            } catch (error) {
                console.error('Error joining session:', error);
                alert('Failed to join session. Please check your network and server.');
            }
        };

        joinSession();

        return () => {
            if (session) {
                session.disconnect();
            }
            setSession(null);
            setPublisher(null);
            setSubscribers([]);
        };
    }, [sessionId]);

    const leaveSession = () => {
        if (session) {
            session.disconnect();
        }
        setSession(null);
        setPublisher(null);
        setSubscribers([]);
    };

    return (
        <div>
            <h2>Session ID: {sessionId}</h2>
            <button onClick={leaveSession}>Leave Session</button>
            {publisher && (
                <div id="publisher">
                    <h3>My Audio</h3>
                    <audio autoPlay={true} ref={(audio) => audio && publisher.addAudioElement(audio)} />
                </div>
            )}
            {subscribers.map((sub, i) => (
                <div key={i} id="subscriber">
                    <h3>Participant {i + 1}</h3>
                    <audio autoPlay={true} ref={(audio) => audio && sub.addAudioElement(audio)} />
                </div>
            ))}
        </div>
    );
};

export default AudioCall;
