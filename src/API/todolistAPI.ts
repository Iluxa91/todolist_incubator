import axios, {AxiosResponse} from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true,
    headers: {
        'api-key': 'f531eeea-9465-4931-943e-b884b6779012'
    }
})

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}

export enum TaskStatuses {
    New,
    InProgress,
    Completed,
    Draft
}

export enum TaskPriorities {
    Low,
    Middle,
    Hi,
    Urgently,
    Later
}

export type TaskType = {
    addedDate: string
    deadline: string
    description: string
    id: string
    order: number
    priority: TaskPriorities
    startDate: string
    status: TaskStatuses
    title: string
    todoListId: string
}

export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}

type GetTasksResponseType = {
    items: TaskType[]
    totalCount: number
    error: string | null
}

export type ResponseType<D = {}> = {
    fieldsErrors: string[]
    resultCode: number
    messages: string[]
    data: D
}

// type CreateTodolistType = {
//     fieldsErrors: string[]
//     resultCode: number
//     messages: string[]
//     data: {item:TodolistType}
// }
// type DeleteTodolistType = {
//     fieldsErrors: string[]
//     resultCode: number
//     messages: string[]
//     data: {}
// }
// type UpdateTodolistType = {
//     fieldsErrors: string[]
//     resultCode: number
//     messages: string[]
//     data: {} +item
// }

export const todolistAPI = {
    getTodolists() {
        return instance.get<TodolistType[]>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodolist(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title})
    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponseType>(`/todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks`, {title})
    },
    deleteTask(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`/todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType<{ item: TaskType }>>(`/todo-lists/${todolistId}/tasks/${taskId}`, model)
    },
}
export const authAPI = {
    login(data:LoginParamsType) {
        return instance.post<LoginParamsType,AxiosResponse<ResponseType<{userId?:number}>>>('/auth/login', data)
    },
    me(){
        return instance.get<ResponseType<{id:number, email:string, login:string}>>('/auth/me')
    },
    logout(){
        return instance.delete<ResponseType>('auth/login')
    }
}

export type LoginParamsType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: string
}