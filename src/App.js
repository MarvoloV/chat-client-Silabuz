import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const conectSocketServer = () => {
  const socket = io('http://localhost:8080', { transports: ['websocket'] });
  return socket;
};

function App() {
  const [socket] = useState(conectSocketServer());
  // const socket = conectSocketServer();
  // console.log('🚀 ~ file: App.js ~ line 11 ~ App ~ socket', socket);
  console.log('render');
  const [online, setOnline] = useState(false);
  const [name, setname] = useState('');
  const [message, setMessage] = useState('');
  const [messageData, setMessageData] = useState([]);
  const [login, setlogin] = useState(false);
  console.log('🚀 ~ file: App.js ~ line 17 ~ App ~ messageData', messageData);
  useEffect(() => {
    socket.on('message-current', (message) => setMessageData(message));
  }, []);

  useEffect(() => {
    socket.on('message-from-server', (mensaje) => {
      setMessageData(mensaje);
    });
  }, [socket]);

  const handlerSubmitMessages = (event) => {
    event.preventDefault();
    const hours = new Date().getHours();
    const minuts = new Date().getMinutes();
    const time = `${hours}:${minuts < 10 ? `0${minuts}` : minuts}`;
    socket.emit('message-to-server', { name, text: message, time });
  };
  const handlerLogin = () => {
    setlogin(true);
  };
  return (
    <div className='App'>
      <h1 className='mt-5 '>Mini Chat</h1>
      <hr />
      {!login && (
        <form onSubmit={handlerLogin}>
          <div className='row'>
            <div className='col-8'>
              <input
                type='text'
                id='txtMensaje'
                placeholder='Ingrese un Nombre'
                className='form-control'
                value={name}
                onChange={(e) => setname(e.target.value)}
              />
            </div>
            <div className='col-4'>
              <button className='btn btn-primary' type='submit'>
                Enviar
              </button>
            </div>
          </div>
        </form>
      )}
      {login && (
        <>
          <div className='wrap-chat'>
            <div className='chat'>
              {messageData.map((message, index) => {
                if (message.name === name) {
                  return (
                    <div className='chat-bubble me' key={index}>
                      <p className='content'>{message.text}</p>
                      <p className='time'>{message.time}</p>
                    </div>
                  );
                } else {
                  return (
                    <div className='chat-bubble you' key={index}>
                      <h1>{message.name}</h1>
                      <p className='content'>{message.text}</p>
                      <p className='time'>{message.time}</p>
                    </div>
                  );
                }
              })}
            </div>
          </div>
          <form
            id='miFormulario'
            className='container'
            onSubmit={handlerSubmitMessages}
          >
            <div className='wrap-message '>
              <div className='message'>
                <input
                  type='text'
                  id='txtMensaje'
                  placeholder='Mensaje'
                  className='form-control'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              {/*  <div className='col-4'>
                <button className='btn btn-primary' type='submit'>
                  Enviar
                </button>
              </div> */}
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default App;
