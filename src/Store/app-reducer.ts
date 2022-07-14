export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'loading' as RequestStatusType,
    error: null as string | null
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppReducerActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        default:
            return state
    }
}

export type AppReducerActionsType = ReturnType<typeof setAppStatusAC> | SetAppErrorActionType
export type SetAppErrorActionType = {
    type: 'APP/SET-ERROR',
    error: string|null
}

export const setAppStatusAC = (status:RequestStatusType) => ({type:'APP/SET-STATUS', status} as const )
export const setAppErrorAC = (error:string|null) => ({type:'APP/SET-ERROR', error} as const )