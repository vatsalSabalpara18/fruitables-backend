import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import { CHAT_URL } from '../../utills/baseURL';

const Chat = () => {
    const socket = io(CHAT_URL);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [to, setTo] = useState('');
    const [group, setGroup] = useState('');
    const [currentGroup, setCurrentGroup] = useState('');

    useEffect(() => {
        socket.on('connect', () => {
            console.log('socket is connected at client side: ' + socket.id);
        })

        socket.on('welcome', (msg) => {
            console.log(msg);
        })

        socket.on("receive_msg", (msg) => {
            console.log("Received message:", msg);
            setMessages(prev => [...prev, msg]);
        })

        return () => {
            socket.off('connect');
            socket.off('welcome');
            socket.off("receive_msg");
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit('send_msg', { message, to });
        setMessage('');
    }

    const handleGroupSubmit = (e) => {
        e.preventDefault();
        if (group) {
            socket.emit('join_group', group);
            setCurrentGroup(group);
            setGroup('');
        }
    }

    const handleGroupMessage = (e) => {
        e.preventDefault();
        if (currentGroup && message) {
            socket.emit('send_group_msg', { message, group: currentGroup });
            setMessage('');
        }
    }

    return (
        <>
            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">Chat</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                    <li className="breadcrumb-item"><a href="#">Pages</a></li>
                    <li className="breadcrumb-item active text-white">Chat</li>
                </ol>
            </div>

            <div className="container-fluid contact py-5">
                <div className="container py-5">
                    <div className="p-5 bg-light rounded">
                        <div className="row g-4">
                            <div className="col-12">
                                <div className="text-center mx-auto" style={{ maxWidth: 700 }}>
                                    <h1 className="text-primary">Get in touch</h1>
                                    <p className="mb-4">The contact form is currently inactive. Get a functional and working contact form with Ajax &amp; PHP in a few minutes. Just copy and paste the files, add a little code and you're done. <a href="https://htmlcodex.com/contact-form">Download Now</a>.</p>
                                </div>
                            </div>

                            <div className='col-lg-7'>
                                <form onSubmit={handleGroupSubmit}>
                                    <div>
                                        <input 
                                            name='group' 
                                            value={group} 
                                            onChange={(e) => setGroup(e.target.value)} 
                                            placeholder='Enter group name' 
                                            className="form-control mb-2"
                                        />                                        
                                    </div>
                                    <button type="submit" className="btn btn-primary">Join Group</button>
                                </form>
                            </div>

                            {currentGroup && (
                                <div className="col-lg-7">
                                    <h4>Current Group: {currentGroup}</h4>
                                    <form onSubmit={handleGroupMessage}>
                                        <div className='mt-2 mb-2'>
                                            <input 
                                                name='message' 
                                                value={message} 
                                                onChange={(e) => setMessage(e.target.value)} 
                                                placeholder='Enter your message' 
                                                className="form-control"
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary">Send Group Message</button>
                                    </form>
                                </div>
                            )}

                            <div className="col-lg-7">
                                <div className="mt-4">
                                    <h4>Messages:</h4>
                                    <div className="messages-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {messages.map((m, i) => (
                                            <div key={i} className="message p-2 mb-2 bg-light rounded">
                                                {m}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chat 