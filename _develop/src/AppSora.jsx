import { useState } from 'react'
import './AppSora.css'
import Caption from './Caption.jsx';
import {sendRequest,addMessageListener} from './common.js';

function AppSora() {
  const [text, setText] = useState('');
  const [textBox, setTextBox] = useState(null);
  const [messages, setMessages] = useState([]);

  //************************************************* */
  //送信
  function sendMessage(type){
    if (textBox == null || textBox.value =="")
      return;
    //送信ロックは10s
    const data = {
      type: type,
      message: text
    };
    try{
          const result = sendRequest(data);
          console.log(result);
    }catch(err){
      console.log(err);
    }
    textBox.value = "";
    setText("");
  }
  //************************************************* */
  //受信
  addMessageListener((event) => { 
    const datas = JSON.parse(event.data);
    console.log("受信：",datas);
    setMessages(messages => [...messages, datas.message]);
  });
  //************************************************* */
  //入力
  function setTextBoxText(textBox){
    setTextBox(textBox);
    setText(textBox.value)
  }
  //************************************************* */
  return (
    <div className="stage">
      <div className="viewMessage">
        <Caption></Caption>
          {messages.map((msg,index)=>(
            <span key={index} className="floating-message">{msg}</span>
          ))}
      </div>
        <div className="frames">
        ここでメッセージを送信するよ<br/>
        <div>
          <input type="text" 
                 className="textBox" 
                 placeholder="なにをおくろう..." 
                 value={text}
                 onChange={(e) => setTextBoxText(e.target)}></input>
        </div>
        <div>
          <span className='button' onClick={ () => sendMessage(1)}>とばす</span>
          <span className='button' onClick={ () => sendMessage(2)}>ながす</span>
          <span className='button' onClick={ () => sendMessage(3)}>おとす</span>
        </div>
      </div>
    </div>
  )
}

export default AppSora
