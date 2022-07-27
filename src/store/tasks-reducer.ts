import {TaskStateType} from "../app/AppWithRedux";
import {AddTodolistAT, ClearTodosDataAT, RemoveTodolistAT, SetTodolistsAT} from "./todolist-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTaskModelType} from "../API/todolistAPI";
import {AppRootStateType, AppThunk} from "./store";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

const initialState: TaskDomainStateType = {}

export const tasksReducer = (state = initialState, action: TasksActionType): TaskDomainStateType => {
    switch (action.type) {
        case'REMOVE-TASK':
            return {...state, [action.todolistID]: state[action.todolistID].filter(t => t.id !== action.taskID)}
        case 'ADD-TASK':
            return {...state, [action.task.todoListId]: [{...action.task, entityStatus:'idle'}, ...state[action.task.todoListId]]}
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistID]: state[action.todolistID].map(t => (t.id === action.taskID) ? {
                    ...t, ...action.model
                } : t)
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
        case 'SET-TASKS':
            // const stateCopy = {...state}
            // stateCopy[action.todolistId] = action.tasks
            // return stateCopy
            return {...state, [action.todolistId]:action.tasks.map(t=> ({...t,entityStatus:'idle'}))}
        case 'CHANGE-TASK-ENTITY-STATUS':
            return {...state,
                [action.todolistId]:state[action.todolistId].map(t=>t.id===action.taskId
                ? {...t, entityStatus: action.status} : t)}
        case 'CLEAR-DATA':
            return {}
        default:
            return state
    }
}

//actions
export const removeTaskAC = (taskID: string, todolistID: string) => ({type: 'REMOVE-TASK', taskID, todolistID} as const)
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (taskID: string, model: UpdateDomainTaskModelType, todolistID: string) => ({
    type: 'UPDATE-TASK', taskID, model, todolistID
} as const)
export const setTasksAC = (tasks: TaskType[], todolistId: string) => ({type: 'SET-TASKS', tasks, todolistId} as const)

export const changeTaskEntityStatusAC = (todolistId: string, taskId: string, status: RequestStatusType) => ({type: 'CHANGE-TASK-ENTITY-STATUS', todolistId, taskId, status} as const)

//thunks
export const fetchTasksTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        dispatch(setAppStatusAC({status: "loading"}))
        todolistAPI.getTasks(todolistId)
            .then((res) => {
                const tasks = res.data.items
                dispatch(setTasksAC(tasks, todolistId))
                dispatch(setAppStatusAC({status: "succeeded"}))
            })
            .catch((err) => {
                handleServerNetworkError(err, dispatch)
            })
    }
}
export const removeTaskTC = (todolistId: string, taskId: string): AppThunk => dispatch => {
    dispatch(setAppStatusAC({status: "loading"}))
    dispatch(changeTaskEntityStatusAC(todolistId,taskId,'loading'))
    todolistAPI.deleteTask(todolistId, taskId)
        .then(() => {
            dispatch(removeTaskAC(taskId, todolistId))
            dispatch(setAppStatusAC({status: "succeeded"}))
        })
        .catch((err) => {
            handleServerNetworkError(err, dispatch)
        })
}
export const addTaskTC = (todolistId: string, title: string): AppThunk => dispatch => {
    dispatch(setAppStatusAC({status: "loading"}))
    todolistAPI.createTask(todolistId, title)
        .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTaskAC(res.data.data.item))
                    dispatch(setAppStatusAC({status: "succeeded"}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            }
        )
        .catch((err) => {
                // dispatch(setAppStatusAC('failed'))
                // dispatch(setAppErrorAC(err.message))
                handleServerNetworkError(err, dispatch)
            }
        )
}
export const updateTaskTC = (taskId: string, todolistId: string, domainModel: UpdateDomainTaskModelType): AppThunk => {
    return (dispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC({status: "loading"}))
        dispatch(changeTaskEntityStatusAC(todolistId,taskId,'loading'))
// так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком
// чтобы у неё отобрать остальные св-ва
        const allTasksFromState = getState().tasks;
        const tasksForCurrentTodolist = allTasksFromState[todolistId]
        const task = tasksForCurrentTodolist.find(t => {
            return t.id === taskId
        })
        if (task) {
            const apiModel: UpdateTaskModelType = {
                title: task.title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: task.status,
                ...domainModel
            }
            todolistAPI.updateTask(todolistId, taskId, apiModel)
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        const action = updateTaskAC(taskId, domainModel, todolistId)
                        dispatch(action)
                        dispatch(setAppStatusAC({status: "succeeded"}))
                        dispatch(changeTaskEntityStatusAC(todolistId,taskId,'succeeded'))
                    } else {
                        handleServerAppError(res.data, dispatch)
                    }
                })
                .catch((error) => {
                    handleServerNetworkError(error, dispatch)
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
    | ClearTodosDataAT
    | ReturnType<typeof setTasksAC>
    | ReturnType<typeof changeTaskEntityStatusAC>
export type TaskDomainStateType = {
    [todoListId: string]: Array<TaskType & {entityStatus: RequestStatusType}>
}


