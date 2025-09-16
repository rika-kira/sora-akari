export const socket = new WebSocket("wss://sora-akari-server.onrender.com");

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
        return "send success";
    }
    catch(err)
    {
        return err;
    }
}




