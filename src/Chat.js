import React, {useEffect, useState} from 'react'
import './Chat.css';
import {Avatar, IconButton} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import AttachFile from '@material-ui/icons/AttachFile'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { InsertEmoticon, Mic } from '@material-ui/icons';
import {useParams} from 'react-router-dom';
import db from './firebase';
import { auth} from './firebase';
import {useStateValue} from './StateProvider';
import firebase from 'firebase';
import 'emoji-picker-element';
import { createPopper } from '@popperjs/core';
import { actionTypes } from './reducer';

function Chat() {

    const [input, setInput] = useState('');
    const [{user}, dispatch] = useStateValue();

    const signOut = () =>
    {
        auth.signOut().then(() => {
            dispatch({
                type: actionTypes.SET_USER,
                user: auth.currentUser,
            })
           
          }).catch((error) => {
            // An error happened.
          });
    }
    

    const sendMessage = (e) => {
        e.preventDefault();
        //console.log('INPUT KI LENGTH DEKH ',input.length);

        if(input.length>0)
        {
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
    }

    /*const [chosenEmoji, setChosenEmoji] = useState(null);

    const [choice, setChoice] = useState(false);
    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
    }

      const handleChange = () => {
        console.log(choice);
        setChoice(!choice);
      }*/

    const {roomId} = useParams();
    const [roomName, setRoomName] = useState('');
    const [messages, setMessages] = useState([]);

    

    const button = document.querySelector('IconButton');
    const tooltip = document.querySelector('.tooltip');
    const tooltipSearch = document.querySelector('.tooltipSearch');

    // Pass the button, the tooltip, and some options, and Popper will do the
    // magic positioning for you:
    createPopper(button, tooltip, {
    placement: 'right',
    });

    const [isText, setisText] = useState(true);

    const toggleText = () => {
        tooltip.classList.toggle('shown', false);
        setisText(!isText);
    }

  function toggle() {
      tooltip.classList.toggle('shown');
      setisText(true);
  }

  function toggleSearch() {
    tooltipSearch.classList.toggle('shown');
}

  function myFunction() {
    // Declare variables
    var input, filter, a, i, rec;
    input = document.getElementById('searchChat');
    if(input)
        filter = input.value.toUpperCase();
        console.log('filter->', filter);
        

        rec = document.querySelectorAll('.chat_message');

        console.log('rec->',rec);
        
        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < rec.length; i++) 
        {
            a = rec[i].innerText;
            
            if(a.toUpperCase().indexOf(filter)!==-1) {
                rec[i].style.display = "";
            }
            else
            {
                rec[i].style.display = "none";
            }
        }
  }

  if(document.querySelector('emoji-picker'))
    document.querySelector('emoji-picker')
  .addEventListener('emoji-click', event => {event.preventDefault();setInput(input+event.detail.emoji.unicode);});

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

    //const d = new Date(messages[messages.length-1]?.timestamp?.toDate());
    //console.log(d.getHours().toString()+':'+d.getMinutes().toString());
    
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
                <Tooltip title="Search">
                    <IconButton>
                        <SearchOutlinedIcon onClick={toggleSearch}/>
                    </IconButton>
                </Tooltip>
                <div class="tooltipSearch" role="tooltip">
                    <input placeholder='Search in this Chat Room' type = 'text' id='searchChat' onChange={myFunction}/>
                </div>

                <Tooltip title='Logout'>
                    <IconButton>
                        <ExitToAppIcon onClick={signOut}/> {/* sign out*/}
                    </IconButton>
                </Tooltip>

                <Tooltip title='More'>
                    <IconButton>
                        <MoreVertIcon/>  {/* for options */}
                    </IconButton>
                </Tooltip>
                    
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

                        <div className='chat_timestamp'>
                                {new Date(message.timestamp?.toDate()).toString()}
                        </div>
                    </div> 
                ))}
                <div class="tooltip" role="tooltip">
                    <emoji-picker></emoji-picker>
                </div>
            </div>

            <div className='chat_footer'>
                
                    <Tooltip title="Emoji">
                            <IconButton>
                                <InsertEmoticon onClick={toggle}/>
                            </IconButton>
                    </Tooltip>
                    
                
                    <Tooltip title="Attach">
                        <IconButton>
                            <AttachFile onClick={toggleText}/> {/* for attachements */}
                        </IconButton>
                    </Tooltip>
                    
                <form>
                    <input value={input} onChange={e=> setInput(e.target.value)} type={isText?'text':'file'} placeholder='Type a message'/>
                    <button onClick={sendMessage} type='submit'>Send</button>
                </form>

                <Tooltip title='Voice Text'>
                    <IconButton>
                        <Mic/>
                    </IconButton>
                </Tooltip>
                
            </div>
        </div>
    )
}

export default Chat
