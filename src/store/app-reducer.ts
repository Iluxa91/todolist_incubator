import {authAPI} from "../API/todolistAPI";
import {AppThunk} from "./store";
import {setIsLoggedInAC} from "./authReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as string | null,
    isInizialized: false
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppReducerActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-IS-INIZIALIZED':
            return {...state, isInizialized: action.isInizialized}
        default:
            return state
    }
}

export type AppReducerActionsType =
    ReturnType<typeof setAppStatusAC>
    | SetAppErrorActionType
    | ReturnType<typeof setisInizializedAC>
export type SetAppErrorActionType = {
    type: 'APP/SET-ERROR',
    error: string | null
}

export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setisInizializedAC = (isInizialized: boolean) => ({type: 'APP/SET-IS-INIZIALIZED', isInizialized} as const)

export const initializeAppTC = (): AppThunk => (dispatch) => {
    authAPI.me()
        .then(res => {
            debugger
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true));
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(err => {
            handleServerNetworkError(err, dispatch)
        })
        .finally(() => dispatch(setisInizializedAC(true)))
}