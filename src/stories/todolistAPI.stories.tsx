import {useEffect, useState} from "react";
import React from "react";
import {todolistAPI} from "../API/todolistAPI";


export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todolistAPI.getTodolists()
            .then(response => {
                setState(response.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolists = () => {
    const [state, setState] = useState<any>(null)
    const [title, setTitle] = useState<string>('')

    const createTodolist = () => {
        todolistAPI.createTodolist(title)
            .then(response => {
                setState(response.data)
            })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'title'}
                   value={title}
                   onChange={(e) => {
                       setTitle(e.currentTarget.value)
                   }}/>
            <button onClick={createTodolist}>create todolist</button>
        </div>
    </div>

}
export const DeleteTodolists = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')

    const deleteTodolist = () => {
        todolistAPI.deleteTodolist(todolistId)
            .then(response => {
                setState(response.data)
            })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'}
                   value={todolistId}
                   onChange={(e) => {
                       setTodolistId(e.currentTarget.value)
                   }}/>
            <button onClick={deleteTodolist}>delete todolist</button>
        </div>
    </div>
}

export const UpdateTodolists = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')
    const [title, setTitle] = useState<string>('')
    const updateTodolistTitle = () => {

        todolistAPI.updateTodolist(todolistId, title)
            .then(response => {
                setState(response.data)
            })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} value={todolistId}
                   onChange={(e) => {
                       setTodolistId(e.currentTarget.value)
                   }}/>
            <input placeholder={'title'}
                   value={title}
                   onChange={(e) => {
                       setTitle(e.currentTarget.value)
                   }}/>
            <button onClick={updateTodolistTitle}>update todolist title</button>
        </div>
    </div>
}
export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')

    const getTasks = () => {
        todolistAPI.getTasks(todolistId)
            .then(response => {
                setState(response.data)
            })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'}
                   value={todolistId}
                   onChange={(e) => {
                       setTodolistId(e.currentTarget.value)
                   }}/>
            <button onClick={getTasks}>get tasks</button>
        </div>
    </div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistID] = useState<string>('')
    const [taskTitle, setTaskTitle] = useState<string>('')

    const createTask = () => {
        todolistAPI.createTask(todolistId, taskTitle)
            .then(response => {
                setState(response.data)
            })
    }
    return <div>{JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} value={todolistId}
                   onChange={(e) => {
                       setTodolistID(e.currentTarget.value)
                   }}/>
            <input placeholder={'taskTitle'} value={taskTitle}
                   onChange={(e) => {
                       setTaskTitle(e.currentTarget.value)
                   }}/>
            <button onClick={createTask}>create task</button>
        </div>
    </div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistID] = useState<string>('')
    const [taskId, setTaskID] = useState<string>('')

    const deleteTask = () => {
        // const taskId = '83213d29-aa0f-4e77-81f7-456f38540451'
        // const todolistId = '99383b08-8409-4a3d-a2d9-f239d5d74ac5'
        todolistAPI.deleteTask(todolistId, taskId)
            .then(res => {
                setState(res.data)
            })
    }
    return <div> {JSON.stringify(state)}
        <div>
            <input placeholder={'todolistId'} value={todolistId}
                   onChange={(e) => {
                       setTodolistID(e.currentTarget.value)
                   }}/>
            <input placeholder={'taskId'} value={taskId}
                   onChange={(e) => {
                       setTaskID(e.currentTarget.value)
                   }}/>
            <button onClick={deleteTask}>delete task</button>
        </div>
    </div>
}
export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [status, setStatus] = useState<number>(0)
    const [priority, setPriority] = useState<number>(0)
    const [startDate, setStartDate] = useState<string>('')
    const [deadline, setDeadline] = useState<string>('')
    const [todolistId, setTodolistId] = useState<string>('')
    const [taskId, setTaskId] = useState<string>('')


    const updateTask = () => {
        todolistAPI.updateTask(todolistId, taskId, {
            deadline: '',
            description: description,
            priority: priority,
            startDate: '',
            status:status,
            title:title

        })
            .then(response => {
                setState(response.data)
            })
    }
    return <div>{JSON.stringify(state)}
    <div>
        <input placeholder={'todolistId'} value={todolistId} onChange={(e) => {setTodolistId(e.currentTarget.value)}}/>
        <input placeholder={'taskId'} value={taskId} onChange={(e) => {setTaskId(e.currentTarget.value)}}/>
        <input placeholder={'task title'} value={title} onChange={(e) => {setTitle(e.currentTarget.value)}}/>
        <input placeholder={'description'} value={description} onChange={(e) => {setDescription(e.currentTarget.value)}}/>
        <input placeholder={'status'} value={status} onChange={(e) => {setStatus(+e.currentTarget.value)}}/>
        <input placeholder={'priority'} value={priority} onChange={(e) => {setPriority(+e.currentTarget.value)}}/>
        <button onClick={updateTask}>update task</button>


    </div>
    </div>
}