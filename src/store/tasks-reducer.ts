import {
    addTodoListAC,
    clearTodosDataAC,
    removeTodoListAC,
    setTodolistsAC
} from "./todolist-reducer";
import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistAPI,
    UpdateTaskModelType
} from "../API/todolistAPI";
import {AppRootStateType, AppThunk} from "./store";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TaskDomainStateType = {}


// ________________________________Thunks________________________________________
export const fetchTasksTC = createAsyncThunk("tasks/fetchTasks", async (todolistId: string, thunkApi) => {
    try {
        thunkApi.dispatch(setAppStatusAC({status: "loading"}))
        const res = await todolistAPI.getTasks(todolistId)
        const tasks = res.data.items
        thunkApi.dispatch(setAppStatusAC({status: "succeeded"}))
        return {tasks, todolistId}
    } catch (err) {
        handleServerNetworkError(err as Error, thunkApi.dispatch)
    }
})
export const removeTaskTC = createAsyncThunk("tasks/removeTask", async (param: { todolistId: string, taskId: string }, thunkApi) => {
    try {
        thunkApi.dispatch(setAppStatusAC({status: "loading"}))
        await todolistAPI.deleteTask(param.todolistId, param.taskId)
        thunkApi.dispatch(setAppStatusAC({status: "succeeded"}))
        return {taskId: param.taskId, todolistId: param.todolistId}
    } catch (err) {
        handleServerNetworkError(err as Error, thunkApi.dispatch)
        return {taskId: param.taskId, todolistId: param.todolistId}
    }
})

const slice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {

        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift({
                ...action.payload.task, entityStatus: "idle"
            })
        },
        updateTaskAC(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        // setTasksAC(state, action: PayloadAction<{ tasks: TaskType[], todolistId: string }>) {
        //     state[action.payload.todolistId] = action.payload.tasks.map((t) => ({
        //         ...t,
        //         entityStatus: "idle"
        //     }))
        // },

        // removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
        //     const tasks = state[action.payload.todolistId]
        //     const index = tasks.findIndex(t => t.id === action.payload.taskId)
        //     if (index > -1) {
        //         tasks.splice(index, 1)
        //     }
        // },

        changeTaskEntityStatusAC(state, action: PayloadAction<{ todolistId: string, taskId: string, status: RequestStatusType }>) {
            state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                t,
                entityStatus: action.payload.status
            } : t)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodoListAC, (state, action) => {
            state[action.payload.todolist.id] = []
        });
        builder.addCase(removeTodoListAC, (state, action) => {
            delete state[action.payload.id]
        });
        builder.addCase(setTodolistsAC, (state, action) => {
            action.payload.todolists.forEach((tl: any) => {
                state[tl.id] = []
            })
        });
        builder.addCase(clearTodosDataAC, (state, action) => {
            return {}
        });
        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            if (action.payload)
                state[action.payload.todolistId] = action.payload.tasks.map((t) => ({
                    ...t,
                    entityStatus: "idle"
                }))
        });
        builder.addCase(removeTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        })
    }
})
export const tasksReducer = slice.reducer
export const {
    addTaskAC,
    updateTaskAC,
    changeTaskEntityStatusAC
} = slice.actions

// export const fetchTasksTC = (todolistId: string): AppThunk => {
//     return (dispatch) => {
//         dispatch(setAppStatusAC({status: "loading"}))
//         todolistAPI.getTasks(todolistId)
//             .then((res) => {
//                 const tasks = res.data.items
//                 dispatch(setTasksAC({tasks, todolistId}))
//                 dispatch(setAppStatusAC({status: "succeeded"}))
//             })
//             .catch((err) => {
//                 handleServerNetworkError(err, dispatch)
//             })
//     }
// }

// export const removeTaskTC = (todolistId: string, taskId: string): AppThunk => dispatch => {
//     dispatch(setAppStatusAC({status: "loading"}))
//     dispatch(changeTaskEntityStatusAC({todolistId, taskId, status: "loading"}))
//     todolistAPI.deleteTask(todolistId, taskId)
//         .then(() => {
//             dispatch(removeTaskAC({taskId, todolistId}))
//             dispatch(setAppStatusAC({status: "succeeded"}))
//         })
//         .catch((err) => {
//             handleServerNetworkError(err, dispatch)
//         })
// }
export const addTaskTC = (todolistId: string, title: string): AppThunk => dispatch => {
    dispatch(setAppStatusAC({status: "loading"}))
    todolistAPI.createTask(todolistId, title)
        .then((res) => {
                if (res.data.resultCode === 0) {
                    dispatch(addTaskAC({task: res.data.data.item}))
                    dispatch(setAppStatusAC({status: "succeeded"}))
                } else {
                    handleServerAppError(res.data, dispatch)
                }
            }
        )
        .catch((err) => {
                handleServerNetworkError(err, dispatch)
            }
        )
}
export const updateTaskTC = (taskId: string, todolistId: string, model: UpdateDomainTaskModelType): AppThunk => {
    return (dispatch, getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC({status: "loading"}))
        dispatch(changeTaskEntityStatusAC({
            todolistId,
            taskId,
            status: "loading"
        }))
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
                ...model
            }
            todolistAPI.updateTask(todolistId, taskId, apiModel)
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        const action = updateTaskAC({taskId, model, todolistId})
                        dispatch(action)
                        dispatch(setAppStatusAC({status: "succeeded"}))
                        dispatch(changeTaskEntityStatusAC({
                            todolistId, taskId, status: "succeeded"
                        }))
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
export type TaskDomainStateType = {
    [todoListId: string]: Array<TaskType & { entityStatus: RequestStatusType }>
}