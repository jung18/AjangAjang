import React, { useRef, useState } from 'react';
import SimplePeer from 'simple-peer';

function ChatTest() {
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const [incomingOffer, setIncomingOffer] = useState("");
  const [incomingAnswer, setIncomingAnswer] = useState("");

  const myAudio = useRef();
  const partnerAudio = useRef();

  // 1. 사용자 오디오 스트림 가져오기
  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(stream);
      myAudio.current.srcObject = stream; // 자신의 오디오를 재생 (테스트용)
    } catch (error) {
      console.error('Error accessing media devices.', error);
    }
  };

  // 2. 통화 시작 (호스트)
  const startCall = () => {
    const p = new SimplePeer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    p.on('signal', (data) => {
      console.log('Signal data (offer):', JSON.stringify(data));
      // 호스트가 생성한 Offer 데이터를 콘솔에 출력
    });

    p.on('stream', (stream) => {
      partnerAudio.current.srcObject = stream; // 게스트의 오디오를 재생
    });

    setPeer(p);
    setCallActive(true);
  };

  // 3. 통화 받기 (게스트)
  const receiveCall = () => {
    const p = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    p.on('signal', (data) => {
      console.log('Signal data (answer):', JSON.stringify(data));
      // 게스트가 생성한 Answer 데이터를 콘솔에 출력
    });

    p.on('stream', (stream) => {
      partnerAudio.current.srcObject = stream; // 호스트의 오디오를 재생
    });

    p.signal(JSON.parse(incomingOffer));
    setPeer(p);
    setCallActive(true);
  };

  // 4. 상대방의 Answer 신호 처리 (호스트)
  const handleSignalData = () => {
    peer.signal(JSON.parse(incomingAnswer));
  };

  return (
    <div>
      <h1>ChatTest - WebRTC 음성 통화</h1>
      <button onClick={getUserMedia}>오디오 활성화</button>
      <button onClick={startCall} disabled={!stream}>
        통화 시작
      </button>
      <textarea
        placeholder="Offer 데이터 입력"
        value={incomingOffer}
        onChange={(e) => setIncomingOffer(e.target.value)}
        rows="4"
        cols="50"
        disabled={callActive}
      />
      <button onClick={receiveCall} disabled={!stream}>
        통화 받기
      </button>
      <textarea
        placeholder="Answer 데이터 입력"
        value={incomingAnswer}
        onChange={(e) => setIncomingAnswer(e.target.value)}
        rows="4"
        cols="50"
        disabled={!callActive}
      />
      <button onClick={handleSignalData} disabled={!incomingAnswer}>
        Answer 처리
      </button>
      <audio ref={myAudio} autoPlay muted={false} />  {/* 자신의 오디오 재생 */}
      <audio ref={partnerAudio} autoPlay />  {/* 상대방의 오디오 재생 */}
      {callActive && <p>통화 중...</p>}
    </div>
  );
}

export default ChatTest;
