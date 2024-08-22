import "./list.scss"


import Userinfo from "./userInfo/Userinfo.jsx"
import ChatList from "./chatList/ChatList.jsx"
const List = () => {
  return (
    <div className='list'>
      <Userinfo/>
      <ChatList/>
    </div>
  )
}

export default List