import React from "react"
import {Provider} from "react-redux"
import {combineReducers} from "redux"
import {v1} from "uuid"
import {tasksReducer} from "../../store/tasks-reducer";
import {todoListsReducer} from "../../store/todolist-reducer";
import {AppRootStateType} from "../../store/store";
import {TaskPriorities, TaskStatuses} from "../../API/todolistAPI";
import {appReducer} from "../../store/app-reducer";
import {authReducer} from "../../store/authReducer";
import {configureStore} from "@reduxjs/toolkit";
import {HashRouter} from "react-router-dom";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todoListsReducer,
    app: appReducer,
    auth: authReducer
})

const initialGlobalState:AppRootStateType = {
    todolists: [
        {id: "todolistId1", title: "What to learn", filter: "all", order:0, addedDate:'',entityStatus:'idle' },
        {id: "todolistId2", title: "What to buy", filter: "all", order:0, addedDate:'',entityStatus:'idle' }
    ],
    tasks: {
        "todolistId1": [
            {id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, todoListId:"todolistId1", addedDate:'', deadline:'', description:'', order: 0, startDate:'', priority:TaskPriorities.Low,entityStatus:'idle'},
            {id: v1(), title: "JS", status: TaskStatuses.Completed,todoListId:"todolistId1", addedDate:'', deadline:'', description:'', order: 0, startDate:'', priority:TaskPriorities.Low,entityStatus:'idle'}
        ],
        "todolistId2": [
            {id: v1(), title: "Milk", status: TaskStatuses.Completed, todoListId:"todolistId2", addedDate:'', deadline:'', description:'', order: 0, startDate:'', priority:TaskPriorities.Low, entityStatus:'idle'},
            {id: v1(), title: "React Book", status: TaskStatuses.Completed, todoListId:"todolistId2", addedDate:'', deadline:'', description:'', order: 0, startDate:'', priority:TaskPriorities.Low, entityStatus:'idle'}
        ]
    },
    app: {status:'idle', error:null, isInizialized: true},
    auth: {isLoggedIn: true}
};

export const storyBookStore = configureStore({
    reducer:rootReducer,
    preloadedState:initialGlobalState
    });

export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider store={storyBookStore}>
        {storyFn()}
    </Provider>)
export const BrowserRouterProviderDecorator = (storyFn: any) => (
    <HashRouter>
        {storyFn()}
    </HashRouter>)