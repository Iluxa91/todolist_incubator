import {TaskStateType} from "../AppWithRedux";
import {AddTodoListAT, RemoveTodoListAT, SetTodolistsAT} from "./todolist-reducer";
import {TaskStatuses, TaskType, todolistAPI} from "../API/todolistAPI";
import {Dispatch} from "redux";
import {AppRootStateType, AppThunk} from "./store";

export type TasksActionType = RemoveTaskAT | AddTaskAT | ChangeTaskStatusAT | ChangeTaskTitleAT
    | AddTodoListAT | RemoveTodoListAT | SetTodolistsAT | SetTasksActionType

type RemoveTaskAT = ReturnType<typeof removeTaskAC>
type AddTaskAT = ReturnType<typeof addTaskAC>
type ChangeTaskStatusAT = ReturnType<typeof changeTaskStatusAC>
type ChangeTaskTitleAT = ReturnType<typeof changeTaskTitleAC>
export type SetTasksActionType = {
    type: 'SET-TASKS'
    tasks: Array<TaskType>
    todolistId: string
}

const initialState: TaskStateType = {}

export const tasksReducer = (state = initialState, action: TasksActionType): TaskStateType => {
    switch (action.type) {
        case'REMOVE-TASK':
            return {
                ...state,
                [action.todolistID]: state[action.todolistID].filter(t => t.id !== action.taskID)
            }
        case 'ADD-TASK':
            // let newTask: TaskType = {
            //     id: v1(),
            //     title: action.title,
            //     status: TaskStatuses.New,
            //     todoListId: action.todolistID,
            //     addedDate: '',
            //     deadline: '',
            //     description: '',
            //     order: 0,
            //     startDate: '',
            //     priority: TaskPriorities.Low
            // }
            return {
                ...state,
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
            }
        case 'CHANGE-TASK-STATUS':
            return {
                ...state,
                [action.todolistID]: state[action.todolistID].map(t => (t.id === action.taskID) ? {
                    ...t,
                    status: action.status
                } : t)
            }
        case "CHANGE-TASK-TITLE":
            return {
                ...state,
                [action.todolistID]: state[action.todolistID].map(t => (t.id === action.taskID) ? {
                    ...t,
                    title: action.title
                } : t)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST':
            // let stateCopy = {...tasks}
            // delete stateCopy[action.id]
            let {[action.id]: [], ...rest} = {...state}
            return rest
        case 'SET-TODOLISTS': {
            const stateCopy = {...state}
            action.todolists.forEach((tl) => {
                stateCopy[tl.id] = []
            })
            return stateCopy;
        }
        case 'SET-TASKS': {
            const stateCopy = {...state}
            stateCopy[action.todolistId] = action.tasks
            return stateCopy
        }
        default:
            return state
    }
}
export const removeTaskAC = (taskID: string, todolistID: string) => ({type: 'REMOVE-TASK', taskID, todolistID} as const)

export const addTaskAC = (task:TaskType) => ({type: 'ADD-TASK', task} as const)

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

export const setTasksAC = (tasks: TaskType[], todolistId: string) => ({type: 'SET-TASKS', tasks, todolistId} as const)

export const fetchTasksTC = (todolistId: string): AppThunk => {
    return (dispatch) => {
        todolistAPI.getTasks(todolistId)
            .then((res) => {
                const tasks = res.data.items
                dispatch(setTasksAC(tasks, todolistId))
            })
    }
}

export const removeTaskTC = (todolistId: string, taskId: string): AppThunk => async dispatch => {
    await todolistAPI.deleteTask(todolistId, taskId)
    dispatch(removeTaskAC(taskId, todolistId))
}

export const addTaskTC = (todolistId:string,title:string):AppThunk => async dispatch => {
    const res = await todolistAPI.createTask(todolistId, title)
    dispatch(addTaskAC(res.data.data.item))
}

export const updateTaskStatusTC = (taskId: string, todolistId: string, status: TaskStatuses):AppThunk => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
// так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком
// чтобы у неё отобрать остальные св-ва
        const allTasksFromState = getState().tasks;
        const tasksForCurrentTodolist = allTasksFromState[todolistId]
        const task = tasksForCurrentTodolist.find(t => {
            return t.id === taskId
        })
        if (task) {
            todolistAPI.updateTask(todolistId, taskId, {
                title: task.title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: status
            }).then(() => {
                const action = changeTaskStatusAC(taskId, status, todolistId)
                dispatch(action)
            })
        }
    }
}

export const updateTaskTitleTC = (taskId: string, todolistId: string, title: string):AppThunk => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
// так как мы обязаны на сервер отправить все св-ва, которые сервер ожидает, а не только
// те, которые мы хотим обновить, соответственно нам нужно в этом месте взять таску целиком
// чтобы у неё отобрать остальные св-ва
        const allTasksFromState = getState().tasks;
        const tasksForCurrentTodolist = allTasksFromState[todolistId]
        const task = tasksForCurrentTodolist.find(t => {
            return t.id === taskId
        })
        if (task) {
            todolistAPI.updateTask(todolistId, taskId, {
                title: title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: task.status
            }).then(() => {
                const action = changeTaskTitleAC(taskId, title, todolistId)
                dispatch(action)
            })
        }
    }
}
