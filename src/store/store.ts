import {AnyAction, combineReducers} from "redux";
import {ThunkAction} from "redux-thunk";
import {appReducer} from "./app-reducer";
import {tasksReducer} from "./tasks-reducer";
import {todoListsReducer} from "./todolist-reducer";
import {authReducer} from "./authReducer";
import {configureStore} from "@reduxjs/toolkit";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todoListsReducer,
    app: appReducer,
    auth:authReducer
})


// непосредственно создаём store
// export const store = createStore(rootReducer,applyMiddleware(thunk));
export const store = configureStore({
    reducer: rootReducer,
})
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;

