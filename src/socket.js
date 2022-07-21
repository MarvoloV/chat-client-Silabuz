import io from "socket.io-client";

const socket = io('https://chat-for-jorge.herokuapp.com/', {
    transports: ['websocket'],
  });

export default socket;