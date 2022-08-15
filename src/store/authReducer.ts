import {setAppStatusAC} from "./app-reducer";
import {authAPI, FieldErrorType, LoginParamsType} from "../API/todolistAPI";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {clearTodosDataAC} from "./todolist-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";


const slice = createSlice({
    name: "auth",
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state) => {
            state.isLoggedIn = true
        })
        builder.addCase(logoutTC.fulfilled, (state) => {
            state.isLoggedIn = false
        })
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions


// _____________________________thunks______________________________
export const loginTC = createAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType, { rejectValue: { errors: string[], fieldsErrors?: FieldErrorType[] } }>("auth/login", async (data, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await authAPI.login(data)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            return {isLoggedIn: true}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({
                errors: res.data.messages,
                fieldsErrors: res.data.fieldsErrors
            })
        }
    } catch (err) {
        const error = err as Error | AxiosError<{ error: string }>
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({
            errors: [error.message],
            fieldsErrors: undefined
        })
    }
})
export const logoutTC = createAsyncThunk("auth/logout", async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setIsLoggedInAC({value: false}))
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            thunkAPI.dispatch(clearTodosDataAC({}))
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({})
        }
    } catch (err) {
        handleServerNetworkError(err as Error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({})
    }
})