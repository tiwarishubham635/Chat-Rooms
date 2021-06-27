import React, {useState, useEffect} from 'react'
import './Sidebar.css'
import {Avatar, IconButton} from '@material-ui/core'
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChatIcon from '@material-ui/icons/Chat';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import SidebarChat from './SidebarChat';
import db from './firebase';
import {useStateValue} from './StateProvider';

function Sidebar() {
    const [rooms, setRooms] = useState([]);
    useEffect(() => {
        const unsubscribe = db.collection('rooms').onSnapshot((snapshot)=>
            setRooms(
                snapshot.docs.map( (doc) =>
                    ({
                        id: doc.id,
                        data: doc.data(),
                    })
                )
            )
        );
        return()=>{
            unsubscribe();
        }
    }, [])

    const [{ user }, dispatch] = useStateValue();

    function myFunction() {
        // Declare variables
        var input, filter, a, i, txtValue;
        input = document.getElementById('myInput');
        console.log(input);
        filter = input.value.toUpperCase();
      
        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < rooms.length; i++) 
        {
          console.log(rooms[i]);
          /*if (a.toUpperCase().indexOf(filter) > -1) {
            rooms[i].style.display = "";
          } else {
            rooms[i].style.display = "none";
          }*/
        }
      }

    return (
        <div className='sidebar'>
            <div className='sidebar_header'>
                <Avatar src={user?.photoURL}/>
                <div className='sidebar_headerRight'>
                    <IconButton>
                        <DonutLargeIcon/> {/* for stories */}
                    </IconButton>

                    <IconButton>
                        <ChatIcon/>    {/* for groups */}
                    </IconButton>

                    <IconButton>
                        <MoreVertIcon/>  {/* for options */}
                    </IconButton>
                </div>
            </div>
            <div className='sidebar_search'>
                <form>
                    <input placeholder='Search or start new chat' type = 'text' />
                </form>
            </div>

            <div className='sidebar_chats'>
                <SidebarChat addNewChat/>
                {rooms.map(room => (
                    <SidebarChat key={room.id} id={room.id} name={room.data.name} />))}
            </div>
        </div>
    )
}

export default Sidebar
