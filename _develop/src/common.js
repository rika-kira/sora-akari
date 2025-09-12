export const socket = new WebSocket("ws://localhost:3001");

socket.onopen = () =>{ }
let isRelation = false;

// メッセージ受信時のイベントを登録
export function addMessageListener(callback) {
    if(!isRelation){
        console.log("受信イベント登録");
        socket.removeEventListener("message", callback);
        socket.addEventListener("message", callback);
        isRelation = true;
    }
}

//サーバ側にデータを送信
export function sendRequest(data)
{
    try
    {
        socket.send(JSON.stringify(data));
        return "OK";
    }
    catch(err)
    {
        return err;
    }
}




