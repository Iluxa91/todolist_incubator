import {authAPI} from "../API/todolistAPI";
import {AppThunk} from "./store";
import {setIsLoggedInAC} from "./authReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as string | null,
    isInizialized: false
}

export type AppInitialStateType = typeof initialState

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppStatusAC(state,action:PayloadAction<{status:RequestStatusType}>){
            state.status = action.payload.status
        },
        setAppErrorAC(state, action:PayloadAction<{error:string | null}>){
            state.error = action.payload.error
        },
        setisInizializedAC(state, action:PayloadAction<{isInizialized:boolean}>){
            state.isInizialized  = action.payload.isInizialized
        }
    }
})

export const appReducer = slice.reducer
export const {setAppStatusAC,setAppErrorAC,setisInizializedAC} = slice.actions

// export const appReducer = (state: InitialStateType = initialState, action: AppReducerActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'APP/SET-STATUS':
//             return {...state, status: action.status}
//         case 'APP/SET-ERROR':
//             return {...state, error: action.error}
//         case 'APP/SET-IS-INIZIALIZED':
//             return {...state, isInizialized: action.isInizialized}
//         default:
//             return state
//     }
// }

// export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
// export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
// export const setisInizializedAC = (isInizialized: boolean) => ({type: 'APP/SET-IS-INIZIALIZED', isInizialized} as const)
export type ErrorUtilsDispatchType = ReturnType<typeof setAppStatusAC> | ReturnType<typeof setAppErrorAC>

export const initializeAppTC = (): AppThunk => (dispatch) => {
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}));
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
        .finally(() => dispatch(setisInizializedAC({isInizialized: true})))
}