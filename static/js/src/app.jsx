import React from 'react';
import ReactDOM from 'react-dom';
import {Home} from './Home.jsx';

const ROOT_ELEMENT = 'main';

var isSoundPlaying = false;


window.onload = function() {
  let root = document.getElementsByTagName(ROOT_ELEMENT)[0];
  console.log('Why are you looking at my code?');
  
  
  ReactDOM.render(<Home />, root);
  
  document.body.onclick = document.body.onscroll = document.body.onkeydown = function() {
    if (!isSoundPlaying) {
      let audio = document.getElementsByTagName('audio')[0];
      audio.volume = 0.1;
      audio.play();
      audio.onended = () => {
        isSoundPlaying = false;
        let timer = Math.floor(Math.random() * (+8000 - +2000)) + +2000;
        setTimeout(() => {
          document.body.onclick();
        }, timer);
      };
    }
  }
}