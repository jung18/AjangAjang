import React, { useRef, useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
// SimplePeer를 올바르게 import합니다.
import SimplePeer from 'simple-peer';


function ChatTest() {
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const [stompClient, setStompClient] = useState(null);

  const myAudio = useRef();
  const partnerAudio = useRef();

  useEffect(() => {
    // WebSocket 서버에 연결
    const socket = new SockJS("http://localhost:8080/ws-stomp");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        console.log("Connected to WebSocket server");

        client.subscribe("/topic/offer", (message) => {
          const data = JSON.parse(message.body);
          if (data.type === "offer") {
            receiveCall(data.offer);
          }
        });

        client.subscribe("/topic/answer", (message) => {
          const data = JSON.parse(message.body);
          if (data.type === "answer") {
            peer.signal(data.answer);
          }
        });
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (stompClient) {
        stompClient.deactivate();
      }
    };
  }, [peer]);

  // 1. 사용자 오디오 스트림 가져오기
  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(stream);
      myAudio.current.srcObject = stream; // 자신의 오디오를 재생 (테스트용)
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  // 2. 통화 시작 (호스트)
  const startCall = () => {
    const p = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    p.on("signal", (data) => {
      console.log("Signal data (offer):", JSON.stringify(data));
      // Offer 데이터를 WebSocket을 통해 게스트에게 전송
      stompClient.publish({
        destination: "/app/offer",
        body: JSON.stringify({ type: "offer", offer: data }),
      });
    });

    p.on("stream", (stream) => {
      partnerAudio.current.srcObject = stream; // 게스트의 오디오를 재생
    });

    setPeer(p);
    setCallActive(true);
  };

  // 3. 통화 받기 (게스트)
  const receiveCall = (offer) => {
    const p = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    p.on("signal", (data) => {
      console.log("Signal data (answer):", JSON.stringify(data));
      // Answer 데이터를 WebSocket을 통해 호스트에게 전송
      stompClient.publish({
        destination: "/app/answer",
        body: JSON.stringify({ type: "answer", answer: data }),
      });
    });

    p.on("stream", (stream) => {
      partnerAudio.current.srcObject = stream; // 호스트의 오디오를 재생
    });

    p.signal(offer);
    setPeer(p);
    setCallActive(true);
  };

  return (
    <div>
      <h1>ChatTest - WebRTC 음성 통화</h1>
      <button onClick={getUserMedia}>오디오 활성화</button>
      <button onClick={startCall} disabled={!stream}>
        통화 시작
      </button>
      <audio ref={myAudio} autoPlay muted={false} /> {/* 자신의 오디오 재생 */}
      <audio ref={partnerAudio} autoPlay /> {/* 상대방의 오디오 재생 */}
      {callActive && <p>통화 중...</p>}
    </div>
  );
}

export default ChatTest;
