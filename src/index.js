import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Amplify } from "aws-amplify";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./utility-react/Errors/ErrorBoundary";
import awsExports from "./aws-exports";

import "bootstrap/dist/css/bootstrap.min.css";

Amplify.configure(awsExports);

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root")
);
