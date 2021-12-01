import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import UserStore from './stores/UserStore';
import GameStore from './stores/GameStore';
import ChatStore from './stores/ChatStore';
//LATER: import reportWebVitals from './reportWebVitals';

export const useUserStore = () => {
  return allStores.userStore
  /*const {userStore: context} = React.useContext(Context)
  if (context === undefined) {
    throw new Error('useUserStore must be used within a CountProvider')
  }
  return context*/
}

export const useGameStore = () => {
  return allStores.gameStore
}

export const useChatStore = () => {
  return allStores.chatStore
}

var allStores = {userStore: new UserStore(), gameStore: new GameStore(), chatStore: new ChatStore()}

// export const Context = React.createContext(null)
// <Context.Provider value={{userStore: new UserStore(), gameStore: new GameStore(), chatStore: new ChatStore()}}>

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//LATER: reportWebVitals();
