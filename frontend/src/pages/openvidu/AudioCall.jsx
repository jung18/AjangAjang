import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';
import React, { useState } from 'react';

const AudioCall = () => {
    const [session, setSession] = useState(null);

    const joinSession = async () => {
        const OV = new OpenVidu();
        const session = OV.initSession();
        setSession(session);

        session.on('streamCreated', (event) => {
            const subscriber = session.subscribe(event.stream, undefined);
            // For audio-only, you don't need to handle video
        });

        try {
            // Create a session and get the sessionId
            const sessionResponse = await axios.post('/api/gopenvidu/sessions');
            const sessionId = sessionResponse.data;

            // Create a token for the session
            const tokenResponse = await axios.post('/api/openvidu/tokens', { sessionId });
            const token = tokenResponse.data;

            // Connect to the session
            await session.connect(token);

            // Publish own audio
            const publisher = OV.initPublisher(undefined, {
                audioSource: undefined, // Use default audio source
                videoSource: undefined, // No video
                publishAudio: true,     // Publish audio
                publishVideo: false,    // Don't publish video
            });
            session.publish(publisher);
        } catch (error) {
            console.error('There was an error connecting to the session:', error.message);
        }
    };

    return (
        <div>
            <button onClick={joinSession}>Join Session</button>
            {/* Video container is not needed for audio-only */}
        </div>
    );
};

export default AudioCall;
