import {TasksActionType, tasksReducer} from './tasks-reducer';
import {TodolistsActionType, todoListsReducer} from './todolist-reducer';
import {applyMiddleware, combineReducers, legacy_createStore as createStore} from 'redux';
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {appReducer, AppReducerActionsType} from "./app-reducer";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todoListsReducer,
    app: appReducer
})


// непосредственно создаём store
export const store = createStore(rootReducer,applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния
export type AppActionsType = TasksActionType | TodolistsActionType | AppReducerActionsType
export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AppActionsType>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;

