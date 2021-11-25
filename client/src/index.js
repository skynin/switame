import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import UserStore from './stores/UserStore';
//LATER: import reportWebVitals from './reportWebVitals';

export const Context = React.createContext(null)

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <Context.Provider value={{userStore: new UserStore()}}>
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
