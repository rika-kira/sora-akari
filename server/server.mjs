    // *************************************************
    //ライブラリ読込等
    // *************************************************
    //サーバ処理用
    import express              from 'express';
    import {WebSocketServer}    from 'ws';
    import {createServer}       from 'http';
    import path                 from 'path';

    // *************************************************
    //初期処理
    // *************************************************
    //サーバ動作管理
    const app = express();
    const clients = [];
    //クライアント→サーバ受信
    const port = 3000;
//    const portSocket = 3001;
    //サーバ→クライアント送信
    const socketServer = createServer();
    const webSocket = new WebSocketServer({noServer:true});

    //ポストを受け取れるようにする
    app.use(express.json());
    // clientフォルダを静的ファイルとして公開
//    app.use(express.static('../client'));
    //サーバ起動イベント
    app.listen(port, () => {
      console.log(`Server running`);
    });
    /*
    socketServer.listen(portSocket, () => {
        console.log(`Server running ws`);
    });
    */
    app.use((req, res) => {
//      res.status(404).sendFile(path.join('https://rika-kira.github.io/sora-akari/404.html'));
    });

    // *************************************************
    //受信まとめ
    // *************************************************
    function generateUniqueId() {
        return 'id-' + Math.random().toString(36).substr(2, 9);
    }
    //クライアントの接続受け取り
    app.on('upgrade', (req, socket, head) => {
        console.log("クライアント接続検知app.on");
        webSocket.handleUpgrade(req, socket, head, (ws) => {
            webSocket.emit('connection', ws, req);
        });
    });
    /*
    //クライアントの接続受け取り
    socketServer.on('upgrade', (req, socket, head) => {
        webSocket.handleUpgrade(req, socket, head, (ws) => {
            webSocket.emit('connection', ws, req);
        });
        *
    });*/
    // *************************************************
    //接続制御
    // *************************************************
    //クライアントの接続
//    webSocket.on('connection', (ws, req) =>{
    app.on('connection', (ws, req) =>{
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
                console.log("【JSON.parse Err】", err);
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
            console.log("【接続エラー】", err);
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
            }catch(err)
            {
                console.log("【sendClient err】", err);
            }
        }
    }
    function getClient(ws){
        const list = clients.filter(item => item != ws);
        if (list.length == 0)
        {
            return null;
        }
        const client = list[Math.floor(Math.random() * list.length)];
        return client;
    }

    //サーバ終了
    process.on('SIGINT', async () => {
        console.log('サーバを終了します....');
        app.delete;
        pool.end();
        process.exit(0);
    });
