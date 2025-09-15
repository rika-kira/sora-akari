import { useEffect, useRef, useState } from 'react';
import React from 'react';
import './CanvasMessages.css';

const CanvasMessages = React.memo(({newMessage}) => {
  const canvasRef = useRef(null);
  const listMessageRef = useRef([]);
  const countRef = useRef(0);
  
  useEffect(() =>{
    let reqId;
    const canvas = canvasRef.current;
    if (!canvas)
      return;
    const ctx = canvas.getContext('2d');

    //取得したメッセージをリストへ追加
    if (newMessage != null && newMessage != "" && newMessage.message != ""){
      let msg = new Message(newMessage.type, newMessage.message, new Date());
      let newX = -1;
      if(listMessageRef.current.length > 0){
        // まず、既存オブジェクトをX順に並べ替え
        const sorted = listMessageRef.current.slice().sort((a, b) => a.x - b.x);
        // 左端から順に隙間をチェック
        let lastX = 0;
        let padding = 5
        for (let i = 0; i < sorted.length; i++) {
          const obj = sorted[i];
          const gap = obj.x - lastX;
          if (gap >= msg.msgWidth + padding * 2) {
             newX = lastX + padding; // 隙間が十分ならここに配置
             continue;
          }
          lastX = obj.x + obj.msgWidth;
        }
        // 最後のオブジェクトの右側に置けるかチェック
        if (canvas.width - lastX >= msg.msgWidth + padding) {
          newX = lastX + padding;
        }
        //おけるところがなければパターンごとにランダムで取得
        if(newX == -1){
          let split = Math.floor(canvas.width / msg.msgWidth);
          let random = Math.floor(Math.random() * split);
          msg.x = random * msg.msgWidth;
          console.log("初期位置確認");
        }else{
          let sukima = canvas.width - newX;
          if (sukima > msg.msgWidth)
          {
            let split = Math.floor(sukima / msg.msgWidth);
            let random = Math.floor(Math.random() * split);
            newX = newX + (random * msg.msgWidth);
          }
          msg.x = newX;
          console.log("隙間");
        }
      }
      listMessageRef.current.push(msg);
    }

    //**************************************
    //描画処理
    const animate = () => {
      const parent = canvas.parentElement;
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      // ピクセルサイズを親に合わせる
      canvas.width = width;
      canvas.height = height;
      // CSSサイズも合わせる（念のため）
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      //経過時間を取得し透明度を決定
      const date = new Date()
      const fadeStart = 20;
      const fadeEnd = 25;
      let delIdx = -1;
      listMessageRef.current.forEach((item,i)=>{
        let sec = (date - item.timeStart) / 1000;
        if (sec <= fadeStart){
          item.transparent = 1.0;
        }else
        {
          const progress = Math.min((sec - fadeStart) / (fadeEnd - fadeStart), 1);
          item.transparent = parseFloat((1.0 - progress).toFixed(2));
        }
        if(sec >= 30){
          delIdx = i;
        }
      });
      if (delIdx>=0){
        listMessageRef.current.splice(delIdx, 1);
      }
      // 描画
      listMessageRef.current.forEach((item,i)=>{
        item.drawMessage(ctx);
        item.getP(height - 5);
      });
      countRef.current += +1;
      reqId = requestAnimationFrame(animate);
    };
    animate();

    return() => cancelAnimationFrame(reqId);
  }, [newMessage])
  return (
    <canvas ref={canvasRef} style={{width:'100%', height:'100%'}}/>
  );
});

//メッセージ情報
class Message{
  constructor(_type, _message, _start){
    this.type = _type;
    this.message = _message;
    this.timeStart = _start;
    //デフォルト値を設定
    this.x = 50;
    this.y = 50;
    this.size = 15;
    this.color = '#28343bff';
    this.msgWidth = this.size * this.message.length;

    this.transparent = 1.0;
    this.count = 0;
    this.countMax = 100;
    //スタートと着地点
    this.startX = 0;
    this.startY = 0;
    this.vy = 0;             // Y方向の速度
    this.gravity = 0.6;      // 重力加速度
    this.bounceFactor = 0.5; // バウンドの反発係数
  }
  setPosition(_x, _y){
    this.x = _x;
    this.y = _y;
  }
  setEmotion(_emositon){
    this.emotion = _emositon;
  }
  setSize(_size){
    this.size = _size
  }
  setColor(_color){
    this.color = _color;
  }
  drawMessage(ctx){
    this.sec = (new Date() - this.timeStart) / 1000;

    ctx.font = this.size + "px DotGothic16";
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.transparent;
    ctx.fillText(this.message, this.x, this.y);
  }
  setNextStep(ctx, windowWith, windowHeight){
    let result = this.getBouncePath(ctx, this.startX, this.startY, 300, windowHeight, this.count, this.countMax);
    this.setPosition(result.x, result.y);
    this.count++;
  }
  getP(_height){
    this.vy += this.gravity;
    this.y += this.vy;

    // 地面に到達したらバウンド
    if (this.y > _height) {
      this.y = _height;
      this.vy *= -this.bounceFactor;

      // 速度が小さくなったら停止
      if (Math.abs(this.vy) < 0.5) {
        this.vy = 0;
      }
    }
  }
}

export default CanvasMessages
