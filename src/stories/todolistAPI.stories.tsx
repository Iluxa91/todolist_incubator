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
               onChange={(e)=>{setTitle(e.currentTarget.value)}}/>
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
        <input placeholder={'todolistId'} onChange={(e)=>{setTodolistId(e.currentTarget.value)}}/>
        <button onClick={deleteTodolist}>delete todolist</button>
    </div>
    </div>
}

export const UpdateTodolists = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('')
    const [title, setTitle] = useState<string>('')
    const updateTodolistTitle = () => {

        todolistAPI.updateTodolist(todolistId,title)
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
               onChange={(e)=>{setTodolistId(e.currentTarget.value)}} />
        <button onClick={getTasks}>get tasks</button>
    </div>
    </div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '3b9918f7-ce54-47c0-948a-f6697d72cea5'
        todolistAPI.createTask(todolistId,'new task')
            .then(response => {
                setState(response.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
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
    useEffect(() => {
        const todolistId = '3b9918f7-ce54-47c0-948a-f6697d72cea5'
        const taskId = '1ea18aca-6d7d-42cf-9578-a68a205d2ba6'
        todolistAPI.updateTask(todolistId,taskId,'OOPs')
            .then(response => {
                setState(response.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}