import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import UserStore from './stores/UserStore';
import GameStore from './stores/GameStore';
//LATER: import reportWebVitals from './reportWebVitals';

export const Context = React.createContext(null)

export const useUserStore = () => {
  const {userStore: context} = React.useContext(Context)
  if (context === undefined) {
    throw new Error('useUserStore must be used within a CountProvider')
  }
  return context
}

export const useGameStore = () => {
  const {gameStore: context} = React.useContext(Context)
  if (context === undefined) {
    throw new Error('useGameStore must be used within a CountProvider')
  }
  return context
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Context.Provider value={{userStore: new UserStore(), gameStore: new GameStore()}}>
      <App />
      </Context.Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//LATER: reportWebVitals();
