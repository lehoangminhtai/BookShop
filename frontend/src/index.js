import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BookContextProvider } from './context/BookContext';


import { Provider } from "react-redux"
import { createStore, applyMiddleware, compose } from "redux"
import { configureStore } from '@reduxjs/toolkit';
import reducers from './reducers'
import {thunk} from "redux-thunk"

import {ContextProvider} from "./context/UserContext"

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>        {/* Redux */}
    <ContextProvider>             {/* Custom Context API */}
      <BookContextProvider>       {/* Book Context */}
         {/* Router */}
          <React.StrictMode>
            <App />
          </React.StrictMode>
       
      </BookContextProvider>
    </ContextProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
