import React from "react";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import AppWithRedux from "./app/AppWithRedux";
import {Provider} from "react-redux";
import {store} from "./store/store";
import {BrowserRouter} from "react-router-dom";
import {createRoot} from "react-dom/client";

const root = createRoot(document.getElementById("root") as HTMLElement)

root.render(
    <BrowserRouter>
        <Provider store={store}>
            <AppWithRedux/>
        </Provider>
    </BrowserRouter>,
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
