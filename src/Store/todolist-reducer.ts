import {todolistAPI, TodolistType} from "../API/todolistAPI";
import {AppThunk} from "./store";
import {Dispatch} from "redux";

const initialState: Array<TodolistDomainType> = []

export const todoListsReducer = (todolists = initialState, action: TodolistsActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todolists.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all'}, ...todolists]
        case 'CHANGE-TODOLIST-FILTER':
            return todolists.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'CHANGE-TODOLIST-TITLE':
            return todolists.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'SET-TODOLISTS':
            return action.todolists.map(tl => ({...tl, filter: 'all'}))
        default:
            return todolists
    }
}

//actions
export const removeTodoListAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodoListAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodoListFilterAC = (filter: FilterValuesType, id: string) => ({
    type: 'CHANGE-TODOLIST-FILTER', filter, id} as const)
export const changeTodoListTitleAC = (title: string, id: string) => ({
    type: 'CHANGE-TODOLIST-TITLE', title, id} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)


//thunks
// export const fetchTodolistsTC = (): AppThunk => (dispatch) => {
//     todolistAPI.getTodolists()
//         .then((res) => {
//             dispatch(setTodolistsAC(res.data))
//         })
// }
export const fetchTodolistsTC = (): AppThunk => async dispatch => {
    const res = await todolistAPI.getTodolists()
    dispatch(setTodolistsAC(res.data))
}
export const removeTodolistTC = (todolistId: string): AppThunk => async dispatch => {
    await todolistAPI.deleteTodolist(todolistId)
    dispatch(removeTodoListAC(todolistId))
}
export const addTodolistTC = (title: string): AppThunk => (dispatch:Dispatch<TodolistsActionType>) => {
    todolistAPI.createTodolist(title)
        .then(res => {
            dispatch(addTodoListAC(res.data.data.item))
        })
}
export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunk =>
    (dispatch:Dispatch<TodolistsActionType>) => {
    todolistAPI.updateTodolist(todolistId, title)
        .then(res => {
            dispatch(changeTodoListTitleAC(title, todolistId))
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
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {filter: FilterValuesType}
export type SetTodolistsAT = ReturnType<typeof setTodolistsAC>
export type RemoveTodolistAT = ReturnType<typeof removeTodoListAC>
export type AddTodolistAT = ReturnType<typeof addTodoListAC>
