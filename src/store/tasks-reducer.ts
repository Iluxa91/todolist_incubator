import {
    addTodolistTC,
    clearTodosDataAC, fetchTodolistsTC, removeTodolistTC,
} from "./todolist-reducer";
import {
    TaskPriorities,
    TaskStatuses,
    TaskType,
    todolistAPI,
    UpdateTaskModelType
} from "../API/todolistAPI";
import {AppRootStateType} from "./store";
import {RequestStatusType, setAppStatusAC} from "./app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TaskDomainStateType = {}

const slice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {
        // setTasksAC(state, action: PayloadAction<{ tasks: TaskType[], todolistId: string }>) {
        //     state[action.payload.todolistId] = action.payload.tasks.map((t) => ({
        //         ...t,
        //         entityStatus: "idle"
        //     }))
        // },
        changeTaskEntityStatusAC(state, action: PayloadAction<{ todolistId: string, taskId: string, status: RequestStatusType }>) {
            state[action.payload.todolistId].map(t => t.id === action.payload.taskId ? {
                t,
                entityStatus: action.payload.status
            } : t)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            state[action.payload.todolist.id] = []
        });
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            delete state[action.payload.id]
        });
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
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
        });
        builder.addCase(addTaskTC.fulfilled, (state, action) => {
            state[action.payload.todoListId].unshift({
                ...action.payload, entityStatus: "idle"
            })
        });
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index > -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        })
    },
})
export const tasksReducer = slice.reducer
export const {
    changeTaskEntityStatusAC
} = slice.actions

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

export const addTaskTC = createAsyncThunk("tasks/addTask",
    async (params: { todolistId: string, title: string }, {
        dispatch,
        rejectWithValue
    }) => {
        try {
            dispatch(setAppStatusAC({status: "loading"}))
            const res = await todolistAPI.createTask(params.todolistId, params.title)
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: "succeeded"}))
                return res.data.data.item
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch (err) {
            handleServerNetworkError(err as Error, dispatch)
            return rejectWithValue(null)
        }
    })

export const updateTaskTC = createAsyncThunk("tasks/updateTask",
    async (params: { taskId: string, todolistId: string, model: UpdateDomainTaskModelType }, {
        dispatch, rejectWithValue, getState
    }) => {
        dispatch(setAppStatusAC({status: "loading"}))
        dispatch(changeTaskEntityStatusAC({
            todolistId: params.todolistId,
            taskId: params.taskId,
            status: "loading"
        }))
        const state = getState() as AppRootStateType
        const task = state.tasks[params.todolistId].find(t => {
            return t.id === params.taskId
        })
        if (!task) {
            return rejectWithValue("task not found in the state")
        }
        const apiModel: UpdateTaskModelType = {
            title: task.title,
            startDate: task.startDate,
            priority: task.priority,
            description: task.description,
            deadline: task.deadline,
            status: task.status,
            ...params.model
        }
        const res = await todolistAPI.updateTask(params.todolistId, params.taskId, apiModel)
        try {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: "succeeded"}))
                dispatch(changeTaskEntityStatusAC({
                    todolistId: params.todolistId,
                    taskId: params.taskId,
                    status: "succeeded"
                }))
                return params
            } else {
                handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
        } catch
            (error) {
            handleServerNetworkError(error as Error, dispatch)
            return rejectWithValue(null)
        }
    })
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

//types
export type TaskDomainStateType = {
    [todoListId: string]: Array<TaskType & { entityStatus: RequestStatusType }>
}
type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}