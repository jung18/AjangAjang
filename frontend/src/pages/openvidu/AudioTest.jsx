import React, { useEffect, useState } from 'react';

const AudioTest = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const wsUrl = "wss://i11b210.p.ssafy.io:8443?sessionId=ses_E47CyFGUTu&token=tok_EHF1BUrCXgzxieYa";
        const newSocket = new WebSocket(wsUrl);

        newSocket.onopen = () => {
            console.log('WebSocket connection opened');
        };

        newSocket.onmessage = (event) => {
            console.log('Message from server ', event.data);
            // 여기서 받은 데이터를 처리할 수 있습니다.
        };

        newSocket.onclose = (event) => {
            console.log('WebSocket connection closed', event);
        };

        newSocket.onerror = (error) => {
            console.error('WebSocket error observed:', error);
        };

        // WebSocket 객체를 상태에 저장
        setSocket(newSocket);

        // 컴포넌트 언마운트 시 WebSocket 연결 종료
        return () => {
            if (newSocket.readyState === WebSocket.OPEN) {
                newSocket.close();
            }
        };
    }, []); // 빈 배열을 두 번째 인자로 전달하여 컴포넌트가 마운트될 때만 실행되게 함

    // 메시지 보내기 기능 (필요한 경우)
    const sendMessage = (message) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        } else {
            console.error('WebSocket is not open. Unable to send message');
        }
    };

    return (
        <div>
            <h1>Audio Call</h1>
            {/* 필요한 경우 메시지를 보내기 위한 버튼 */}
            <button onClick={() => sendMessage('Hello, Server!')}>Send Message</button>
        </div>
    );
};

export default AudioTest;
