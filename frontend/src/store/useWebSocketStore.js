// useWebSocketStore.js
import create from 'zustand';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const useWebSocketStore = create((set) => ({
  client: null,
  connected: false,

  connect: (url) => {
    const socket = new SockJS(url);
    const client = Stomp.over(socket);

    client.connect({}, () => {
      set({ client, connected: true });
    }, (error) => {
      console.error('WebSocket connection error:', error);
      set({ connected: false });
    });
  },

  disconnect: () => {
    const { client } = useWebSocketStore.getState();
    if (client && client.connected) {
      client.disconnect(() => {
        console.log('WebSocket disconnected');
        set({ connected: false });
      });
    }
  },

  subscribe: (destination, callback) => {
    const { client } = useWebSocketStore.getState();
    if (client && client.connected) {
      const subscription = client.subscribe(destination, (message) => {
        const parsedMessage = JSON.parse(message.body);
        callback(parsedMessage);
      });
      return subscription;
    }
    return null;
  },
}));

export default useWebSocketStore;
