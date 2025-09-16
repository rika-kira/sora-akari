import { useState } from 'react'
import './AppSora.css'
import Caption from './Caption.jsx';
import CanvasMessages from './CanvasMessages.jsx';
import State from './State.jsx';
import {sendRequest,addMessageListener} from './common.js';

function AppSora() {
  const [text, setText] = useState('');
  const [textBox, setTextBox] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [canvasKey, setCanvasKey] = useState(0);
  const [stateShow, setStateShow] = useState(false);

  //************************************************* */
  //送信
  function sendMessage(type){
    if (textBox == null || textBox.value =="")
      return;
    //送信ロックは10s
    if (stateShow){
      return;
    }
    
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
    setStateShow(true);
    textBox.value = "";
    setText("");
  }
  //************************************************* */
  //受信
  addMessageListener((event) => { 
    console.log("受信：",messageData);
    const datas = JSON.parse(event.data);
    const messageData = {
      type:datas.type,
      message:datas.message,
      start:new Date()
    };
    setNewMessage(messageData);
    
    if (canvasKey>100){
      setCanvasKey(0);
    }else{
      setCanvasKey(canvasKey + 1);
    }

  });
  //************************************************* */
  //入力
  function setTextBoxText(_textBox){
    setTextBox(_textBox);
    setText(_textBox.value)
  }
  //************************************************* */
  return (
    <div className="stage">
      <div className="viewMessage">
        <Caption></Caption>
        <CanvasMessages newMessage={newMessage}></CanvasMessages>
      </div>
      <div className="frames">
        ここでメッセージを送信するよ
        <span id="state">{stateShow && <State key={new Date()} 
                                              startSeconds={10} 
                                              onFinish={() => setStateShow(false)} />}
        </span>
        <br/>
        <div>
          <input type="text" 
                 className="textBox" 
                 placeholder="なにをおくろう..." 
                 maxLength={30}
                 value={text}
                 onChange={(e) => setTextBoxText(e.target)}></input>
        </div>
        <div>
          <span className='button' onClick={ () => sendMessage(1)}>おくる</span>
        </div>
      </div>
    </div>
  )
}

export default AppSora
