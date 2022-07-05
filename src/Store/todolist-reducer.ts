import {v1} from "uuid";
import {todolistAPI, TodolistType} from "../API/todolistAPI";
import {Dispatch} from "redux";
import {AppActionsType, AppRootStateType, AppThunk} from "./store";

export type TodolistsActionType =
    RemoveTodoListAT
    | AddTodoListAT
    | ChangeTodoListFilterAT
    | ChangeTodoListTitleAT
    | SetTodolistsAT
export type RemoveTodoListAT = {
    type: 'REMOVE-TODOLIST'
    id: string
}
export type AddTodoListAT = {
    type: 'ADD-TODOLIST'
    todolist:TodolistType
}
type ChangeTodoListFilterAT = {
    type: 'CHANGE-TODOLIST-FILTER'
    filter: FilterValuesType
    id: string
}
type ChangeTodoListTitleAT = {
    type: 'CHANGE-TODOLIST-TITLE'
    title: string
    id: string
}
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}
export type SetTodolistsAT = ReturnType<typeof setTodolistsAC>

const initialState: Array<TodolistDomainType> = []

export const todoListsReducer = (todolists = initialState, action: TodolistsActionType): Array<TodolistDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todolists.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            const newTodoList: TodolistDomainType = {
                ...action.todolist,
                filter: 'all'
            }
            return [newTodoList,...todolists]
        case 'CHANGE-TODOLIST-FILTER':
            return todolists.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
        case 'CHANGE-TODOLIST-TITLE':
            return todolists.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
        case 'SET-TODOLISTS': {
            return action.todolists.map(tl => ({
                ...tl,
                filter: 'all'
            }))
        }
        default:
            return todolists
    }
}
export const removeTodoListAC = (id: string): RemoveTodoListAT => ({type: 'REMOVE-TODOLIST', id})
export const AddTodoListAC = (todolist: TodolistType): AddTodoListAT => ({type: 'ADD-TODOLIST', todolist})
export const ChangeTodoListFilterAC = (filter: FilterValuesType, id: string): ChangeTodoListFilterAT => ({
    type: 'CHANGE-TODOLIST-FILTER',
    filter,
    id
})
export const ChangeTodoListTitleAC = (title: string, id: string): ChangeTodoListTitleAT => ({type: 'CHANGE-TODOLIST-TITLE', title, id})
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)

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

export const addTodolistTC = (title:string):AppThunk => (dispatch) => {
    todolistAPI.createTodolist(title)
        .then (res => {
            dispatch(AddTodoListAC(res.data.data.item))
        })
}

export const changeTodolistTitleTC = (todolistId:string,title:string):AppThunk => (dispatch) => {

        todolistAPI.updateTodolist(todolistId,title)
            .then(res => {
                dispatch(ChangeTodoListTitleAC(todolistId,title))
            })
}



