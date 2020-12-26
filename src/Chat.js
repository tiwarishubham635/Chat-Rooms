import React, {useEffect, useState} from 'react'
import './Chat.css';
import {Avatar, IconButton} from '@material-ui/core';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AttachFile from '@material-ui/icons/AttachFile'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { InsertEmoticon, Mic } from '@material-ui/icons';
import {useParams} from 'react-router-dom';
import db from './firebase';
import {useStateValue} from './StateProvider';
import firebase from 'firebase';
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';

function Chat() {

    const [input, setInput] = useState('');
    const [{user}, dispatch] = useStateValue();
    const sendMessage = (e) => {
        e.preventDefault();
        console.log('you typed ',input);

        db.collection('rooms')
          .doc(roomId)
          .collection('messages')
          .add({
              message: input,
              name: user.displayName,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(), 
          })
        setInput('');
    }

    const [chosenEmoji, setChosenEmoji] = useState(null);

    const [choice, setChoice] = useState(false);
    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
    }

      const handleChange = () => {
        console.log(choice);
        setChoice(!choice);
      }

    const {roomId} = useParams();
    const [roomName, setRoomName] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if(roomId) {
            db.collection('rooms')
            .doc(roomId)
            .onSnapshot(snapshot => (
                setRoomName(snapshot.data().name)
            ));

            db.collection('rooms')
            .doc(roomId)
            .collection('messages')
            .orderBy('timestamp','asc')
            .onSnapshot((snapshot) =>
                setMessages(snapshot.docs.map((doc)=> doc.data()))
            );
        }
    }, [roomId])
    
    return (
        <div className='chat'>
            <div className='chat_header'>
                <Avatar src={`https://avatars.dicebear.com/api/human/${roomId}.svg`}/>
                <div className='chat_headerInfo'>
                    <h3>{roomName}</h3>
                    <p>
                        Last Seen{' '}
                        {new Date(
                            messages[messages.length-1]?.timestamp?.toDate()
                        ).toString()}
                    </p>
                </div>
                <div className='chat_headerRight'>
                    <IconButton>
                        <SearchOutlinedIcon/>    {/* for search */}
                    </IconButton>

                    <IconButton>
                        <AttachFile/> {/* for attachements */}
                    </IconButton>

                    <IconButton>
                        <MoreVertIcon/>  {/* for options */}
                    </IconButton>
                </div>
            </div>

            <div className='chat_body'>
                {messages.map((message)=>(
                   <div className={`chat_message ${message.name===user.displayName&&"chat_reciever"}`}>
                        <div className='chat_name'>
                            {message.name}
                        </div>
                        <span className='chat_messageText'>
                                {message.message}
                            </span>
                            <span className='chat_timestamp'>
                                {new Date(message.timestamp?.toDate()).toUTCString()}
                            </span>
                    </div> 
                ))}
                
            </div>

            <div className='chat_footer'>
                <IconButton>
                    <InsertEmoticon onClick={handleChange}/>
                </IconButton>

                {choice && 
                    <div style={{marginTop: "-40vh"}}>
                    <Picker onEmojiClick={onEmojiClick} skinTone={SKIN_TONE_MEDIUM_DARK}/>
                    </div>
                }
                {/*chosenEmoji&&setInput(input+chosenEmoji.emoji)
                    chosenEmoji&&console.log(input+chosenEmoji.emoji)*/
                }   

                <form>
                    <input value={input} onChange={e=> setInput(e.target.value)} type='text' placeholder='Type a message'/>
                    <button onClick={sendMessage} type='submit'>Send</button>
                </form>

                <IconButton>
                    <Mic/>
                </IconButton>
            </div>
        </div>
    )
}

export default Chat
