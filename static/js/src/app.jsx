import React from 'react';
import ReactDOM from 'react-dom';
import {Home} from './Home.jsx';

const ROOT_ELEMENT = 'main';

window.onload = function() {
  let root = document.getElementsByTagName(ROOT_ELEMENT)[0];
  console.log('Why are you looking at my code?');
  ReactDOM.render(<Home />, root);
}