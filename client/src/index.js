import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import "antd/dist/antd.css";

import {createStore} from 'redux';
import { Provider } from "react-redux";
import {composeWithDevTools} from 'redux-devtools-extension';
import rootReducer from './reducers';

//store
const store = createStore(rootReducer, composeWithDevTools());

// Stabilize ResizeObserver callbacks from UI libraries to avoid loop errors.
if (typeof window !== "undefined" && window.ResizeObserver) {
  const NativeResizeObserver = window.ResizeObserver;

  window.ResizeObserver = class ResizeObserver extends NativeResizeObserver {
    constructor(callback) {
      super((entries, observer) => {
        window.requestAnimationFrame(() => callback(entries, observer));
      });
    }
  };
}

// Ignore noisy ResizeObserver warnings from UI libraries in development.
const resizeObserverErrors = [
  "ResizeObserver loop completed with undelivered notifications.",
  "ResizeObserver loop limit exceeded",
];

const suppressResizeObserverError = (event) => {
  if (resizeObserverErrors.includes(event.message)) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
};

window.addEventListener("error", suppressResizeObserverError, true);

const originalConsoleError = console.error;
console.error = (...args) => {
  const firstArg = args[0];

  if (
    typeof firstArg === "string" &&
    resizeObserverErrors.some((message) => firstArg.includes(message))
  ) {
    return;
  }

  originalConsoleError(...args);
};

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
    <App />
  </BrowserRouter>
  </Provider>,
  // </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
