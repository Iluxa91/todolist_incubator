import {todolistAPI, TodolistType} from "../API/todolistAPI";
import {AppThunk} from "./store";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {fetchTasksTC} from "./tasks-reducer";
import {Dispatch} from "redux";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: "todolists",
    initialState: initialState,
    reducers: {
        removeTodoListAC: (state, action: PayloadAction<{ id: string }>) => {
            return state.filter(tl => tl.id !== action.payload.id)
        },
        addTodoListAC: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            state.unshift({...action.payload.todolist, filter: "all", entityStatus: "idle"})
        },
        changeTodoListTitleAC: (state, action: PayloadAction<{ title: string, id: string }>) => {
            const index = state.findIndex(tl=>tl.id === action.payload.id)
            state[index].title = action.payload.title
        },
        changeTodoListFilterAC: (state, action: PayloadAction<{ filter: FilterValuesType, id: string }>) => {
            const index = state.findIndex(tl=>tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        setTodolistsAC: (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {
           return action.payload.todolists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        },
        changeTodolistEntityStatusAC: (state, action: PayloadAction<{ todolistId: string, status: RequestStatusType }>) => {
            const index = state.findIndex(tl=>tl.id === action.payload.todolistId)
            state[index].entityStatus = action.payload.status
        },
        clearTodosDataAC: (state, action: PayloadAction<{}>) => {
                return []
        }
    }
})

export const todoListsReducer = slice.reducer
export const {
    removeTodoListAC,
    addTodoListAC,
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    setTodolistsAC,
    changeTodolistEntityStatusAC,
    clearTodosDataAC
} = slice.actions

//thunks
export const fetchTodolistsTC = (): AppThunk => async dispatch => {
    dispatch(setAppStatusAC({status: "loading"}))
    todolistAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC({todolists: res.data}))
            dispatch(setAppStatusAC({status: "succeeded"}))
            return res.data
        })
        .then((todos) => {
            todos.forEach((tl) => {
                dispatch(fetchTasksTC(tl.id))
            })

        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}
export const removeTodolistTC = (todolistId: string): AppThunk => async dispatch => {
    dispatch(setAppStatusAC({status: "loading"}))
    dispatch(changeTodolistEntityStatusAC({todolistId, status: "loading"}))
    todolistAPI.deleteTodolist(todolistId)
        .then(() => {
            dispatch(removeTodoListAC({id: todolistId}))
            dispatch(setAppStatusAC({status: "succeeded"}))
            dispatch(changeTodolistEntityStatusAC({todolistId, status: "succeeded"}))
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}
export const addTodolistTC = (title: string): AppThunk => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    todolistAPI.createTodolist(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodoListAC({todolist: res.data.data.item}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}
export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))
    todolistAPI.updateTodolist(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodoListTitleAC({title, id: todolistId}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
}

//types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType =
    TodolistType
    & { filter: FilterValuesType, entityStatus: RequestStatusType }
