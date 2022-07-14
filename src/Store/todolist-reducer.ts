import {todolistAPI, TodolistType} from "../API/todolistAPI";
import {AppThunk} from "./store";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

const initialState: Array<TodolistDomainType> = []

export const todoListsReducer = (todolists = initialState, action: TodolistsActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todolists.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...todolists]
        case 'CHANGE-TODOLIST-FILTER':
            return todolists.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'CHANGE-TODOLIST-TITLE':
            return todolists.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: 'idle'}))
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return todolists.map(tl => tl.id === action.todolistId ? {...tl, entityStatus: action.status} : tl)
        default:
            return todolists
    }
}

//actions
export const removeTodoListAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodoListAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodoListFilterAC = (filter: FilterValuesType, id: string) => ({
    type: 'CHANGE-TODOLIST-FILTER', filter, id
} as const)
export const changeTodoListTitleAC = (title: string, id: string) => ({
    type: 'CHANGE-TODOLIST-TITLE', title, id
} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)
export const changeTodolistEntityStatusAC = (todolistId: string, status: RequestStatusType) => ({
    type: 'CHANGE-TODOLIST-ENTITY-STATUS', todolistId, status
} as const)

//thunks
// export const fetchTodolistsTC = (): AppThunk => (dispatch) => {
//     todolistAPI.getTodolists()
//         .then((res) => {
//             dispatch(setTodolistsAC(res.data))
//         })
// }
export const fetchTodolistsTC = (): AppThunk => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC(res.data))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch(err=>{
            handleServerNetworkError(err,dispatch)
        })
}
export const removeTodolistTC = (todolistId: string): AppThunk => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
    todolistAPI.deleteTodolist(todolistId)
        .then(()=>{
            dispatch(removeTodoListAC(todolistId))
            dispatch(setAppStatusAC('succeeded'))
            dispatch(changeTodolistEntityStatusAC(todolistId, 'succeeded'))
        })
        .catch(err=>{
            handleServerNetworkError(err,dispatch)
        })
}
export const addTodolistTC = (title: string): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    todolistAPI.createTodolist(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodoListAC(res.data.data.item))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handleServerAppError(res.data,dispatch)
            }
        })
        .catch(err=>{
            handleServerNetworkError(err,dispatch)
        })
}
export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk =>
    (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistAPI.updateTodolist(todolistId, title)
            .then(res => {
                if(res.data.resultCode===0){
                    dispatch(changeTodoListTitleAC(title, todolistId))
                    dispatch(setAppStatusAC('succeeded'))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            })
            .catch(err=>{
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
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & { filter: FilterValuesType, entityStatus: RequestStatusType }
export type SetTodolistsAT = ReturnType<typeof setTodolistsAC>
export type RemoveTodolistAT = ReturnType<typeof removeTodoListAC>
export type AddTodolistAT = ReturnType<typeof addTodoListAC>
