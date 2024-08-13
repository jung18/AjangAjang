import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import styles from './ChatRoom.module.css';
import apiClient from '../../api/apiClient';
import usePageStore from '../../store/currentPageStore'; // 페이지 스토어 import
import useTokenStore from '../../store/useTokenStore';

const ChatRoom = () => {
    const [rooms, setRooms] = useState([]);
    const [newMessages, setNewMessages] = useState(() => {
        const savedMessages = localStorage.getItem('newMessages');
        return savedMessages ? JSON.parse(savedMessages) : {};
    });
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const navigate = useNavigate();
    const stompClientRef = useRef(null);	
    const setCurrentPage = usePageStore((state) => state.setCurrentPage); // 페이지 저장 함수 가져오기

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await apiClient.get('/api/rooms/myRooms');
                const roomsData = response.data;
                console.log(roomsData);
                const updatedMessages = roomsData.reduce((acc, room) => {
                    acc[room.id] = {
                        lastMessage: room.lastMessage,
                        unreadCount: room.unreadCount,
                        lastReadTime: room.lastReadTime,
                    };
                    return acc;
                }, {});

                setRooms(roomsData);
                setNewMessages(updatedMessages);
            } catch (error) {
                console.error('방 목록을 가져오는 중 오류 발생:', error);
            }
        };

        fetchRooms();
    }, []);

    useEffect(() => {
        localStorage.setItem('newMessages', JSON.stringify(newMessages));
    }, [newMessages]);

    useEffect(() => {
    if (rooms.length > 0) {
        const socket = new SockJS('https://i11b210.p.ssafy.io:4443/ws-stomp');
        const client = Stomp.over(socket);

        if (stompClientRef.current && stompClientRef.current.connected) {
            return; // 이미 연결되어 있으면 새로운 연결을 만들지 않음
        }

        const accessToken = useTokenStore.getState().accessToken; // 상태에서 액세스 토큰 가져오기
        console.log(accessToken);

        // 헤더를 통해 액세스 토큰을 전달합니다.
        client.connect(
            { Authorization: accessToken }, // 토큰을 헤더에 추가
            () => {
                console.log("WebSocket에 연결됨");
                stompClientRef.current = client;

                rooms.forEach(room => {
                    client.subscribe(`/sub/chat/${room.id}`, (msg) => {
                        const message = JSON.parse(msg.body);
                        const isCurrentRoom = room.id === currentRoomId;
                        const lastReadTime = new Date(newMessages[room.id]?.lastReadTime || room.lastReadTime);

                        setNewMessages(prev => {
                            const newUnreadCount = (!isCurrentRoom && new Date(message.time) > lastReadTime) 
                                ? (prev[room.id]?.unreadCount || 0) + 1 
                                : prev[room.id]?.unreadCount || 0;

                            const updatedMessages = {
                                ...prev,
                                [room.id]: {
                                    ...prev[room.id],
                                    lastMessage: message.message,
                                    unreadCount: newUnreadCount
                                }
                            };

                            localStorage.setItem('newMessages', JSON.stringify(updatedMessages));
                            return updatedMessages;
                        });
                    });
                });
            },
            (error) => {
                console.error('WebSocket 연결 오류:', error);
                if (error.headers && error.headers['message'] && error.headers['message'].includes('401')) {
                    console.log('Unauthorized, attempt to refresh token');
                    // 여기서 토큰 갱신 로직을 추가할 수 있습니다.
                }
            }
        );

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.disconnect();
                stompClientRef.current = null;
            }
        };
    }
}, [rooms, currentRoomId, newMessages]);

    
    const handleRoomClick = async (roomId) => {
        if (!roomId) {
            console.error('roomId가 정의되지 않았거나 null입니다.');
            return;
        }

        setCurrentRoomId(roomId);

        try {
            await apiClient.post(`/api/rooms/${roomId}/read`);
            setNewMessages(prev => {
                const updatedMessages = {
                    ...prev,
                    [roomId]: {
                        ...prev[roomId],
                        unreadCount: 0,
                        lastReadTime: new Date().toISOString(),
                    }
                };
                localStorage.setItem('newMessages', JSON.stringify(updatedMessages));
                return updatedMessages;
            });
        } catch (error) {
            console.error('읽음 상태를 업데이트하는 중 오류 발생:', error);
        }
        setCurrentPage('chat');

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
                                {newMessages[room.id]?.unreadCount > 0 && (
                                    <div className={styles['unread-indicator']}>{newMessages[room.id].unreadCount}</div>
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
