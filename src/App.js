/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
const conectSocketServer = () => {
  const socket = io('https://chat-for-jorge.herokuapp.com/', { transports: ['websocket'] });
  return socket;
};

function App() {
  const createdRoom = uuidv4();
  const [socket] = useState(conectSocketServer());
  // const [online, setOnline] = useState(false);
  const [name, setname] = useState('');
  const [message, setMessage] = useState('');
  const [messageData, setMessageData] = useState([]);
  const [users, setUsers] = useState([]);
  const [login, setlogin] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('');
  useEffect(() => {
    socket.on('message-current', (message) => setMessageData(message));
  }, []);

  useEffect(() => {
    socket.on('message-from-server', (mensaje) => {
      setMessageData(mensaje);
    });
  }, [socket]);
  useEffect(() => {
    socket.on('users-from-server', (users) => {
      setUsers(users);
    });
  }, [socket]);

  const handlerSubmitMessages = (event) => {
    event.preventDefault();
    const hours = new Date().getHours();
    const minuts = new Date().getMinutes();
    const time = `${hours}:${minuts < 10 ? `0${minuts}` : minuts}`;
    const sendMessage = {
      message,
      name,
      time,
      currentRoom,
    };
    socket.emit('message-to-server', { sendMessage, currentRoom });
    setMessage('');
  };
  const handlerLogin = (event) => {
    event.preventDefault();
    socket.emit('add-user-to-server', { userName: name, room: createdRoom });
    setlogin(true);
  };
  return (
    <div className='App'>
      <h1 style={{ textAlign: 'center', marginTop: '20px'}}>Chat Grupal</h1>
      {!login && (
        <form onSubmit={handlerLogin} className='formLogin'>
          <div className='row'>
            <div className='col-8'>
              <input
                type='text'
                id='txtMensaje'
                placeholder='Ingrese un Nombre'
                className='form-control'
                value={name}
                onChange={(e) => setname(e.target.value)}
                style={{
                  marginTop: '20px',
                  border: '1px solid ',
                  borderRadius: '20px',
                  padding: '10px',
                  width: '300px',
                }}
              />
            </div>
            <div>
              <button
                type='submit'
                style={{
                  marginTop: '20px',
                  marginLeft: '90px',
                  padding: '10px 42px',
                  border: '1px solid',
                  background: 'green',
                  color: 'white',
                  fontSize: '20px',
                  borderRadius: '10px',
                }}
              >
                Enviar
              </button>
            </div>
          </div>
        </form>
      )}
      {login && (
        <div className='wrap'>
          {/* <section className='left'>
            <div className='contact-list'>
              {users.map((user, index) => {
                if (user.userName !== name) {
                  return (
                    <div
                      className='contact'
                      onClick={() => setCurrentRoom(user.room)}
                      key={index}
                    >
                      <img
                        src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/1089577/contact7.JPG'
                        alt='profilpicture'
                      />
                      <div className='contact-preview'>
                        <div className='contact-text'>
                          <h1 className='font-name'>{user.userName}</h1>
                          <p className='font-preview'>
                            Mmh, lecker :) Freu mich!
                          </p>
                        </div>
                      </div>
                      <div className='contact-time'>
                        <p>17:54</p>
                      </div>
                    </div>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </section> */}
          <section className='right'>
            <div className='wrap-chat'>
              <div className='chat'>
                {messageData.map((message, index) => {
                  if (message.sendMessage.name === name) {
                    return (
                      <div className='chat-bubble me' key={index}>
                        <p className='content'>{message.sendMessage.message}</p>
                        <p className='time'>{message.sendMessage.time}</p>
                      </div>
                    );
                  } else {
                    return (
                      <div className='chat-bubble you' key={index}>
                        <h1>{message.sendMessage.name}</h1>
                        <p className='content'>{message.sendMessage.message}</p>
                        <p className='time'>{message.sendMessage.time}</p>
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
                    className='input-message'
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
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
