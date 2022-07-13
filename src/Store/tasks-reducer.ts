import {TaskStateType} from "../App/AppWithRedux";
import {AddTodolistAT, RemoveTodolistAT, SetTodolistsAT} from "./todolist-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTaskModelType} from "../API/todolistAPI";
import {Dispatch} from "redux";
import {AppRootStateType, AppThunk} from "./store";
import {setAppErrorAC, setAppStatusAC} from "./app-reducer";

const initialState: TaskStateType = {}

export const tasksReducer = (state = initialState, action: TasksActionType): TaskStateType => {
    switch (action.type) {
        case'REMOVE-TASK':
            return {...state,[action.todolistID]: state[action.todolistID].filter(t => t.id !== action.taskID)}
        case 'ADD-TASK':
            return {...state,[action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistID]: state[action.todolistID].map(t => (t.id === action.taskID) ? {
                    ...t, ...action.model} : t)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST':
            let {[action.id]: [], ...rest} = {...state}
            return rest
        case 'SET-TODOLISTS':
            const stateCopy = {...state}
            action.todolists.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        case 'SET-TASKS': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = action.tasks
            return stateCopy
        }
        default:
            return state
    }
}

//actions
export const removeTaskAC = (taskID: string, todolistID: string) => ({type: 'REMOVE-TASK', taskID, todolistID} as const)
export const addTaskAC = (task:TaskType) => ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (taskID: string, model: UpdateDomainTaskModelType, todolistID: string) => ({
    type: 'UPDATE-TASK', taskID, model, todolistID} as const)
export const setTasksAC = (tasks: TaskType[], todolistId: string) => ({type: 'SET-TASKS', tasks, todolistId} as const)

//thunks
export const fetchTasksTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatusAC('loading'))
        todolistAPI.getTasks(todolistId)
            .then((res) => {
                const tasks = res.data.items
                dispatch(setTasksAC(tasks, todolistId))
                dispatch(setAppStatusAC('succeeded'))
            })
    }
}
export const removeTaskTC = (todolistId: string, taskId: string): AppThunk => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    await todolistAPI.deleteTask(todolistId, taskId)
    dispatch(removeTaskAC(taskId, todolistId))
    dispatch(setAppStatusAC('loading'))
}
export const addTaskTC = (todolistId:string,title:string):AppThunk => async dispatch => {
    dispatch(setAppStatusAC('loading'))
    const res = await todolistAPI.createTask(todolistId, title)
    if(res.data.resultCode===0){
        dispatch(addTaskAC(res.data.data.item))
        dispatch(setAppStatusAC('succeeded'))
    } else {
        if (res.data.messages.length){
            dispatch(setAppErrorAC(res.data.messages[0]))
        } else {
            dispatch(setAppErrorAC('Some error occured'))
        }
        dispatch(setAppStatusAC('failed'))
    }
}
export const updateTaskTC = (taskId: string, todolistId: string, domainModel:UpdateDomainTaskModelType):AppThunk => {
    return (dispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC('loading'))
// так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком
// чтобы у неё отобрать остальные св-ва
        const allTasksFromState = getState().tasks;
        const tasksForCurrentTodolist = allTasksFromState[todolistId]
        const task = tasksForCurrentTodolist.find(t => {
            return t.id === taskId
        })
        if (task) {
            const apiModel:UpdateTaskModelType = {
                title: task.title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: task.status,
                ...domainModel
            }
            todolistAPI.updateTask(todolistId, taskId, apiModel)
                .then(() => {
                const action = updateTaskAC(taskId, domainModel, todolistId)
                dispatch(action)
                    dispatch(setAppStatusAC('succeeded'))
            })
        }
    }
}
type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

//types
export type TasksActionType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistAT
    | RemoveTodolistAT
    | SetTodolistsAT
    | ReturnType<typeof setTasksAC>
