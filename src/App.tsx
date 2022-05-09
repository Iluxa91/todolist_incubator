import React, {useState} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from "./AddItemForm";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}
export type TaskStateType = {
    [todoListId: string]: Array<TaskType>
}
type TaskType = {
    id: string
    title: string
    isDone: boolean
}


function App() {
    const todoListId_1 = v1()
    const todoListId_2 = v1()

    const [todoLists, setTodoList] = useState<Array<TodolistType>>([
            {id: todoListId_1, title: "What to learn", filter: "all"},
            {id: todoListId_2, title: "What to buy", filter: "all"},
        ]
    )
    const [tasks, setTasks] = useState<TaskStateType>({
        [todoListId_1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: true},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false},
        ],
        [todoListId_2]: [
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "Sugar", isDone: true},
            {id: v1(), title: "Tea", isDone: true},
            {id: v1(), title: "Paper", isDone: false},
        ]
    });


    function removeTask(id: string, todoListId: string) {
        setTasks({...tasks, [todoListId]: tasks[todoListId].filter(t => t.id != id)});
    }

    function addTask(title: string, todoListId: string) {
        let newTask: TaskType = {id: v1(), title: title, isDone: false};
        setTasks({...tasks, [todoListId]: [newTask, ...tasks[todoListId]]});
    }

    const CheckBoxChange = (currentID: string, isDone: boolean, toDoListId: string) => {
        setTasks({
            ...tasks,
            [toDoListId]: tasks[toDoListId].map(t => t.id === currentID ? {...t, isDone} : t)
        })
    }
    const changeTaskTitle = (currentID: string, title: string, toDoListId: string) => {
        setTasks({
            ...tasks,
            [toDoListId]: tasks[toDoListId].map(t => t.id === currentID ? {...t, title} : t)
        })
    }

    const removeTodoList = (todoListId: string) => {
        setTodoList(todoLists.filter(tl => tl.id !== todoListId))
        delete tasks[todoListId]
    }
    const addTodoList = (title: string) => {
        const newTodoListID = v1()
        const newTodoList:TodolistType = {
            id:newTodoListID,
            title:title,
            filter:'all',
        }
        setTodoList ([...todoLists, newTodoList])
        setTasks({...tasks,[newTodoListID]:[]})
    }

    let [filter, setFilter] = useState<FilterValuesType>("all");

    function changeTodoListFilter(filter: FilterValuesType, todoListId: string) {
        setTodoList(todoLists.map(tl => tl.id === todoListId ? {...tl, filter} : tl))
    }
    function changeTodoListTitle(title: string, todoListId: string) {
        setTodoList(todoLists.map(tl => tl.id === todoListId ? {...tl, title:title} : tl))
    }

    const toDoListForRender = todoLists.map(tl => {

        let tasksForTodolist = tasks[tl.id];

        if (tl.filter === "active") {
            tasksForTodolist = tasksForTodolist.filter(t => !t.isDone);
        }
        if (tl.filter === "completed") {
            tasksForTodolist = tasksForTodolist.filter(t => t.isDone);
        }
        return <Todolist
            key={tl.id}
            title={tl.title}
            filter={tl.filter}
            toDoListId={tl.id}
            tasks={tasksForTodolist}
            removeTask={removeTask}
            changeTodoListFilter={changeTodoListFilter}
            changeTodoListTitle={changeTodoListTitle}
            addTask={addTask}
            CheckBoxChange={CheckBoxChange}
            changeTaskTitle={changeTaskTitle}
            removeTodoList={removeTodoList}
        />
    })

    return (
        <div className="App">
            <AddItemForm addItem={addTodoList}/>
            {toDoListForRender}
        </div>
    );
}

export default App;
