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
            state.filter(tl => tl.id !== action.payload.id)
        },
        addTodoListAC: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            state.push({...action.payload.todolist, filter: "all", entityStatus: "idle"})
        },

        changeTodoListFilterAC: (state, action: PayloadAction<{ filter: FilterValuesType, id: string }>) => {

        },
        changeTodoListTitleAC: (state, action: PayloadAction<{ title: string, id: string }>) => {

        },
        setTodolistsAC: (state, action: PayloadAction<{ todolists: Array<TodolistType> }>) => {

        },
        changeTodolistEntityStatusAC: (state, action: PayloadAction<{ todolistId: string, status: RequestStatusType }>) => {

        },
        clearTodosDataAC: (state, action: PayloadAction<{}>) => {

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

// export const todoListsReducer = (todolists = initialState, action: TodolistsActionType): Array<TodolistDomainType> => {
//     switch (action.type) {
//         case "REMOVE-TODOLIST":
//             return todolists.filter(tl => tl.id !== action.id)
//         case "ADD-TODOLIST":
//             return [{
//                 ...action.todolist,
//                 filter: "all",
//                 entityStatus: "idle"
//             }, ...todolists]
//         case "CHANGE-TODOLIST-FILTER":
//             return todolists.map(tl => tl.id === action.id ? {
//                 ...tl,
//                 filter: action.filter
//             } : tl)
//         case "CHANGE-TODOLIST-TITLE":
//             return todolists.map(tl => tl.id === action.id ? {
//                 ...tl,
//                 title: action.title
//             } : tl)
//         case "SET-TODOLISTS":
//             return action.todolists.map(tl => ({
//                 ...tl,
//                 filter: "all",
//                 entityStatus: "idle"
//             }))
//         case "CHANGE-TODOLIST-ENTITY-STATUS":
//             return todolists.map(tl => tl.id === action.todolistId ? {
//                 ...tl,
//                 entityStatus: action.status
//             } : tl)
//         case "CLEAR-DATA":
//             return []
//         default:
//             return todolists
//     }
// }

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
            dispatch(changeTodolistEntityStatusAC({todolistId,status: "succeeded"}))
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
                dispatch(changeTodoListTitleAC({title,id: todolistId}))
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
export type TodolistsActionType =
    | RemoveTodolistAT
    | ReturnType<typeof setTodolistsAC>
    | ReturnType<typeof changeTodoListFilterAC>
    | ReturnType<typeof changeTodoListTitleAC>
    | SetTodolistsAT
    | AddTodolistAT
    | ReturnType<typeof changeTodolistEntityStatusAC>
    | ClearTodosDataAT
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType =
    TodolistType
    & { filter: FilterValuesType, entityStatus: RequestStatusType }
export type SetTodolistsAT = ReturnType<typeof setTodolistsAC>
export type RemoveTodolistAT = ReturnType<typeof removeTodoListAC>
export type AddTodolistAT = ReturnType<typeof addTodoListAC>
export type ClearTodosDataAT = ReturnType<typeof clearTodosDataAC>
