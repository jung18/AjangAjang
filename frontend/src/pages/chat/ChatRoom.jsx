import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 가져옵니다.
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import './ChatRoom.css';
import apiClient from '../../api/apiClient'

const ChatRoom = () => {
    const [rooms, setRooms] = useState([]);
    const [newMessages, setNewMessages] = useState({});
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 가져옵니다.

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
            const socket = new SockJS('http://i11b210.p.ssafy.io:4443/ws-stomp');
            const client = Stomp.over(socket);
            client.connect({}, () => {
                console.log("Connected to WebSocket");
                rooms.forEach(room => {
                    console.log(`Subscribing to room ${room.id}`); // 콘솔 로그 추가
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
                if (client) client.disconnect();
            };
        }
    }, [rooms, currentRoomId]);

    const handleRoomClick = (roomId) => {
        console.log(`Room clicked: ${roomId}`); // 콘솔 로그 추가
        setCurrentRoomId(roomId);
        setNewMessages(prev => ({
            ...prev,
            [roomId]: {
                ...prev[roomId],
                unreadCount: 0
            }
        }));
        navigate(`/room/${roomId}`); // 클릭 시 페이지 이동
    };

    return (
        <div className="room-list-container">
            <h1>Chat Rooms</h1>
            <ul className="room-list">
                {rooms.map(room => (
                    <li 
                        key={room.id} 
                        className="room-item"
                        onClick={() => handleRoomClick(room.id)}
                    >
                        <div className="room-info">
                            <div className="room-header">
                                <div className="room-name">{room.name}</div>
                                {newMessages[room.id]?.unreadCount > 0 && (
                                    <div className="unread-count">{newMessages[room.id].unreadCount}</div>
                                )}
                            </div>
                            <div className="room-last-message">
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
