import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import './ChatRoom.css';

const ChatRoom = () => {
    const [rooms, setRooms] = useState([]);
    const [newMessages, setNewMessages] = useState({});
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/rooms');
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
    }, []);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws-stomp');
        const client = Stomp.over(socket);
        setStompClient(client);

        client.connect({}, () => {
            rooms.forEach(room => {
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
    }, [rooms, currentRoomId]);

    const handleRoomClick = useCallback((roomId) => {
        setCurrentRoomId(roomId);
        setNewMessages(prev => ({
            ...prev,
            [roomId]: {
                ...prev[roomId],
                unreadCount: 0
            }
        }));
    }, []);

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
                        <Link to={`/room/${room.id}`} className="room-link">
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
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatRoom;
