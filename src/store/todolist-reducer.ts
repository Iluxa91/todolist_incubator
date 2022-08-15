import {todolistAPI, TodolistType} from "../API/todolistAPI";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {fetchTasksTC} from "./tasks-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";


const slice = createSlice({
    name: "todolists",
    initialState: [] as Array<TodolistDomainType>,
    reducers: {
        changeTodoListFilterAC: (state, action: PayloadAction<{ filter: FilterValuesType, id: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].filter = action.payload.filter
        },
        changeTodolistEntityStatusAC: (state, action: PayloadAction<{ todolistId: string, status: RequestStatusType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId)
            state[index].entityStatus = action.payload.status
        },
        clearTodosDataAC: (state, action: PayloadAction<{}>) => {
            return []
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todolists.map(tl => ({
                ...tl,
                filter: "all",
                entityStatus: "idle"
            }))
        });
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            return state.filter(tl => tl.id !== action.payload.id)
        });
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state.unshift({
                ...action.payload.todolist,
                filter: "all",
                entityStatus: "idle"
            })
        });
        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            state[index].title = action.payload.title
        });
    }
})

export const todoListsReducer = slice.reducer
export const {
    changeTodoListFilterAC,
    changeTodolistEntityStatusAC,
    clearTodosDataAC
} = slice.actions

//thunks
export const removeTodolistTC = createAsyncThunk("todolists/removeTodolist",
    async (todolistId: string, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusAC({status: "loading"}))
        dispatch(changeTodolistEntityStatusAC({todolistId, status: "loading"}))
        const res = await todolistAPI.deleteTodolist(todolistId)
        try {
            dispatch(setAppStatusAC({status: "succeeded"}))
            dispatch(changeTodolistEntityStatusAC({todolistId, status: "succeeded"}))
            return {id: todolistId}
        } catch (err) {
            handleServerNetworkError(err as Error, dispatch)
            return rejectWithValue(null)
        }
    })

export const addTodolistTC = createAsyncThunk("todolists/addTodolist",
    async (title: string, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusAC({status: "loading"}))
        const res = await todolistAPI.createTodolist(title)
        try {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: "succeeded"}))
                return {todolist: res.data.data.item}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (err) {
            handleServerNetworkError(err as Error, dispatch)
            return rejectWithValue(null)
        }
    })

export const changeTodolistTitleTC = createAsyncThunk("todolists/changeTodolistTitle",
    async (param: { todolistId: string, title: string }, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusAC({status: "loading"}))
        const res = await todolistAPI.updateTodolist(param.todolistId, param.title)
        try {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: "succeeded"}))
                return {title: param.title, id: param.todolistId}
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (err) {
            handleServerNetworkError(err as Error, dispatch)
            return rejectWithValue(null)
        }
    })

export const fetchTodolistsTC = createAsyncThunk("todolists/fetchTodolists",
    async (param, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusAC({status: "loading"}))
        const res = await todolistAPI.getTodolists()
        try {
            res.data.forEach((tl) => {
                dispatch(fetchTasksTC(tl.id))
            })
            return {todolists: res.data}
        } catch (err) {
            handleServerNetworkError(err as Error, dispatch)
            return rejectWithValue(null)
        }
    })

//types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType =
    TodolistType & { filter: FilterValuesType, entityStatus: RequestStatusType }
