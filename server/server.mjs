    // *************************************************
    //ライブラリ読込等
    // *************************************************
    //サーバ処理用
    import express              from 'express';
    import {WebSocketServer}    from 'ws';
    import {createServer}       from 'http';
    import dotenv               from 'dotenv';

    // *************************************************
    //初期処理
    // *************************************************
    dotenv.config();
    //サーバ動作管理
    const app = express();

    const clients = [];
    const socketServer = createServer(app);
    const webSocket = new WebSocketServer({noServer:true});

    socketServer.on('upgrade', (req, socket, head) => {
        webSocket.handleUpgrade(req, socket, head, (ws) => {
            webSocket.emit('connection', ws, req);
        });
    });

    const port = Number(process.env.PORT);
    socketServer.listen(port, () => {
        console.log(`Server running ws`);
    });

    // *************************************************
    //接続制御
    // *************************************************
    function generateUniqueId() {
        return 'id-' + Math.random().toString(36).substr(2, 9);
    }
    //クライアントの接続
    webSocket.on('connection', (ws, req) =>{
        const clientId = generateUniqueId();
        clients.push({id:clientId, socket:ws});
        //クライアントからリクエスト
        ws.on('message', (msg) =>{
            let getData;
            //受信データ変換
            try
            {
                getData = JSON.parse(msg);
                console.log(getData);
            }
            catch(err)
            {
                console.log("JSON.parse Err ", err);
                return;
            }
            const type = getData.type;
            const message = getData.message;

            sendClient(ws, type, message);
            
        });
        //クライアント接続終了
        ws.on('close', () => {
            const index = clients.findIndex(client => client.id === ws.clientId);
            if (index !== -1) {
            clients.splice(index, 1);
            }
        });
        //クライアント接続エラー
        ws.on('error', (err) =>{
            console.log("onOpen err ", err);
        });
    });

    // *************************************************
    //送信
    // *************************************************
    //クライアントに送信
    async function sendClient(ws, type, message)
    {
        const sendData = JSON.stringify({type:type, message:message});
        const client = getClient(ws);
        if (client != null && client.socket.readyState === 1) {
            try
            {
                await client.socket.send(sendData);
                console.log("another send..");
            }catch(err)
            {
                console.log("sendClient err ", err);
            }
        }else{
            console.log("alone..");
        }
    }
    function getClient(ws){
        const list = clients.filter(item => item.socket != ws);
        if (list.length == 0)
        {
            return null;
        }
        const client = list[Math.floor(Math.random() * list.length)];
        return client;
    }

    //サーバ終了
    process.on('SIGINT', async () => {
        console.log('server close...');
        app.delete;
        process.exit(0);
    });
