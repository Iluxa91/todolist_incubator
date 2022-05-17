import {FilterValuesType, TodolistType} from "../App";
import {v1} from "uuid";
export type ActionType = RemoveTodoListAT | AddTodoListAT | ChangeTodoListFilterAT | ChangeTodoListTitleAT
type RemoveTodoListAT = {
    type: 'REMOVE-TODOLIST'
    id:string
}
type AddTodoListAT = {
    type: 'ADD-TODOLIST'
    title: string
}
type ChangeTodoListFilterAT = {
    type: 'CHANGE-TODOLIST-FILTER'
    filter: FilterValuesType
    id: string
}
type ChangeTodoListTitleAT = {
    type:'CHANGE-TODOLIST-TITLE'
    title: string
    id: string
}

export const todoListsReducer = (todolists:Array<TodolistType>, action: ActionType):Array<TodolistType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return todolists.filter(tl => tl.id !== action.id)
        case 'ADD-TODOLIST':
            const newTodoListID = v1()
            const newTodoList: TodolistType = {
                id: newTodoListID,
                title: action.title,
                filter: 'all',
            }
            return [...todolists, newTodoList]
        case 'CHANGE-TODOLIST-FILTER':
            return todolists.map(tl => tl.id === action.id ? {...tl, filter:action.filter} : tl)
        case 'CHANGE-TODOLIST-TITLE':
            return todolists.map(tl => tl.id === action.id ? {...tl, title:action.title} : tl)
        default:
            return todolists
    }
}
export const removeTodoListAC = (id:string):RemoveTodoListAT => ({type: 'REMOVE-TODOLIST',id})
export const AddTodoListAC = (title:string):AddTodoListAT => ({type: 'ADD-TODOLIST',title})
export const ChangeTodoListFilterAC = (filter: FilterValuesType,id: string):ChangeTodoListFilterAT => ({type: 'CHANGE-TODOLIST-FILTER',filter,id})
export const ChangeTodoListTitleAC = (title:string,id:string):ChangeTodoListTitleAT => ({type:'CHANGE-TODOLIST-TITLE',title,id})