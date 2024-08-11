import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import styles from './ChatRoom.module.css'; // CSS 모듈 import
import apiClient from '../../api/apiClient';

const ChatRoom = () => {
    const [rooms, setRooms] = useState([]);
    const [newMessages, setNewMessages] = useState({});
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const navigate = useNavigate();
    const stompClientRef = useRef(null);  // stompClient를 useRef로 관리

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await apiClient.get('/api/rooms/myRooms');
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
    }, []);

    useEffect(() => {
        if (rooms.length > 0) {
            const socket = new SockJS('https://i11b210.p.ssafy.io:8443/ws-stomp');
            const client = Stomp.over(socket);
            client.connect({}, () => {
                console.log("Connected to WebSocket");
                stompClientRef.current = client;  // stompClient 저장

                rooms.forEach(room => {
                    console.log(`Subscribing to room ${room.id}`);
                    client.subscribe(`/sub/chat/${room.id}`, (msg) => {
                        const message = JSON.parse(msg.body);
                        setNewMessages(prev => ({
                            ...prev,
                            [room.id]: {
                                lastMessage: message.message,
                                unreadCount: room.id === currentRoomId ? 0 : (prev[room.id]?.unreadCount || 0) + 1
                            }
                        }));
                    });
                });
            });

            return () => {
                if (stompClientRef.current) {
                    stompClientRef.current.disconnect();
                    stompClientRef.current = null;  // 연결 해제 후 null로 초기화
                }
            };
        }
    }, [rooms, currentRoomId]);

    const handleRoomClick = (roomId) => {
        console.log(`Room clicked: ${roomId}`);
        
        if (!roomId) {
            console.error('roomId is undefined or null');
            return;
        }
    
        setCurrentRoomId(roomId);
        setNewMessages(prev => ({
            ...prev,
            [roomId]: {
                ...prev[roomId],
                unreadCount: 0
            }
        }));

        navigate(`/room/${roomId}`);
    };
    
    return (
        <div className={styles['room-list-container']}>
            <div className={styles.header}>
                <span className={styles['header-title']}>채팅</span>
                <div className={styles['filter-buttons']}>
                    <button className={styles['filter-button']}>전체</button>
                    <button className={styles['filter-button']}>판매</button>
                    <button className={styles['filter-button']}>구매</button>
                </div>
            </div>
            <ul className={styles['room-list']}>
                {rooms.map(room => (
                    <li 
                        key={room.id} 
                        className={styles['room-item']}
                        onClick={() => handleRoomClick(room.id)}
                    >
                        <div className={styles['room-avatar']}>
                            {/* 프로필 이미지를 추가할 수 있습니다. */}
                        </div>
                        <div className={styles['room-info']}>
                            <div className={styles['room-header']}>
                                <div className={styles['room-name']}>{room.name}</div>
                                <div className={styles['room-time']}></div>
                                {newMessages[room.id]?.unreadCount > 0 && (
                                    <div className={styles['unread-indicator']}></div>
                                )}
                            </div>
                            <div className={styles['room-last-message']}>
                                <span>{newMessages[room.id]?.lastMessage || room.lastMessage}</span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatRoom;
