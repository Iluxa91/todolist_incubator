import {TaskStateType} from "../AppWithRedux";
import {v1} from "uuid";
import {AddTodoListAT, RemoveTodoListAT} from "./todolist-reducer";
import {TaskPriorities, TaskStatuses, TaskType} from "../API/todolistAPI";

export type ActionType =
    RemoveTaskAT
    | AddTaskAT
    | ChangeTaskStatusAT
    | ChangeTaskTitleAT
    | AddTodoListAT
    | RemoveTodoListAT

type RemoveTaskAT = ReturnType<typeof removeTaskAC>
type AddTaskAT = ReturnType<typeof addTaskAC>
type ChangeTaskStatusAT = ReturnType<typeof changeTaskStatusAC>
type ChangeTaskTitleAT = ReturnType<typeof changeTaskTitleAC>

const initialState:TaskStateType = {}

export const tasksReducer = (tasks=initialState, action: ActionType): TaskStateType => {
    switch (action.type) {
        case'REMOVE-TASK':
            return {
                ...tasks,
                [action.todolistID]: tasks[action.todolistID].filter(t => t.id !== action.taskID)
            }
        case 'ADD-TASK':
            let newTask: TaskType = {id: v1(), title: action.title, status: TaskStatuses.New, todoListId:action.todolistID, addedDate:'', deadline:'', description:'', order: 0, startDate:'', priority:TaskPriorities.Low}
            return {
                ...tasks,
                [action.todolistID]: [newTask, ...tasks[action.todolistID]]
            }
        case 'CHANGE-TASK-STATUS':
            return {
                ...tasks,
                [action.todolistID]: tasks[action.todolistID].map(t => (t.id === action.taskID) ? {
                    ...t,
                    status: action.status
                } : t)
            }
        case "CHANGE-TASK-TITLE":
            return {
                ...tasks,
                [action.todolistID]: tasks[action.todolistID].map(t => (t.id === action.taskID) ? {
                    ...t,
                    title: action.title
                } : t)
            }
        case 'ADD-TODOLIST':
            return {...tasks, [action.todolistId]: []}
        case 'REMOVE-TODOLIST':
            // let stateCopy = {...tasks}
            // delete stateCopy[action.id]
           let {[action.id]:[], ...rest} = {...tasks}
           return rest
        default:
            return tasks
    }
}
export const removeTaskAC = (taskID: string, todolistID: string) => ({type: 'REMOVE-TASK', taskID, todolistID} as const)

export const addTaskAC = (title: string, todolistID: string) => ({type: 'ADD-TASK', title, todolistID} as const)

export const changeTaskStatusAC = (taskID: string, status: TaskStatuses, todolistID: string) => ({
    type: 'CHANGE-TASK-STATUS',
    taskID,
    status,
    todolistID
} as const)

export const changeTaskTitleAC = (taskID: string, title: string, todolistID: string) => ({
    type: 'CHANGE-TASK-TITLE',
    taskID,
    title,
    todolistID
} as const)