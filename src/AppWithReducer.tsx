import React, {useReducer, useState} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import {Menu} from "@material-ui/icons";
import {
    AddTodoListAC,
    ChangeTodoListFilterAC,
    ChangeTodoListTitleAC,
    removeTodoListAC,
    todoListsReducer
} from "./reducers/todolist-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./reducers/tasks-reducer";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}
export type TaskStateType = {
    [todoListId: string]: Array<TaskType>
}
export type TaskType = {
    id: string
    title: string
    isDone: boolean
}


function AppWithReducer() {
    const todoListId_1 = v1()
    const todoListId_2 = v1()

    const [todoLists, dispatchToTodoList] = useReducer(todoListsReducer,[
            {id: todoListId_1, title: "What to learn", filter: "all"},
            {id: todoListId_2, title: "What to buy", filter: "all"},
        ])
    const [tasks, dispatchToTasks] = useReducer(tasksReducer,{
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
    let [filter, setFilter] = useState<FilterValuesType>("all");

    function removeTask(id: string, todoListId: string) {
       /* setTasks({...tasks, [todoListId]: tasks[todoListId].filter(t => t.id != id)});*/
        dispatchToTasks(removeTaskAC(id,todoListId))
    }
    function addTask(title: string, todoListId: string) {
        // let newTask: TaskType = {id: v1(), title: title, isDone: false};
        // setTasks({...tasks, [todoListId]: [newTask, ...tasks[todoListId]]});
        dispatchToTasks(addTaskAC(title,todoListId))
    }
    const CheckBoxChange = (currentID: string, isDone: boolean, toDoListId: string) => {
        // setTasks({
        //     ...tasks,
        //     [toDoListId]: tasks[toDoListId].map(t => t.id === currentID ? {...t, isDone} : t)
        // })
        dispatchToTasks(changeTaskStatusAC(currentID,isDone,toDoListId))
    }
    const changeTaskTitle = (currentID: string, title: string, toDoListId: string) => {
        // setTasks({
        //     ...tasks,
        //     [toDoListId]: tasks[toDoListId].map(t => t.id === currentID ? {...t, title} : t)
        // })
        dispatchToTasks(changeTaskTitleAC(currentID,title,toDoListId))
    }
    const removeTodoList = (todoListId: string) => {
        // setTodoList(todoLists.filter(tl => tl.id !== todoListId))
        // delete tasks[todoListId]
        let action = removeTodoListAC(todoListId)
        dispatchToTodoList(action)
        dispatchToTasks(action)
    }
    const addTodoList = (title: string) => {
        // const newTodoListID = v1()
        // const newTodoList: TodolistType = {
        //     id: newTodoListID,
        //     title: title,
        //     filter: 'all',
        // }
        // setTodoList([...todoLists, newTodoList])
        // setTasks({...tasks, [newTodoListID]: []})
        let action = AddTodoListAC(title)
        dispatchToTodoList(action)
        dispatchToTasks(action)
    }

    function changeTodoListFilter(filter: FilterValuesType, todoListId: string) {
        // setTodoList(todoLists.map(tl => tl.id === todoListId ? {...tl, filter} : tl))
        dispatchToTodoList(ChangeTodoListFilterAC(filter,todoListId))
    }
    function changeTodoListTitle(title: string, todoListId: string) {
        // setTodoList(todoLists.map(tl => tl.id === todoListId ? {...tl, title: title} : tl))
        dispatchToTodoList(ChangeTodoListTitleAC(title,todoListId))
    }

    const toDoListForRender = todoLists.map(tl => {

        let tasksForTodolist = tasks[tl.id];

        if (tl.filter === "active") {
            tasksForTodolist = tasksForTodolist.filter(t => !t.isDone);
        }
        if (tl.filter === "completed") {
            tasksForTodolist = tasksForTodolist.filter(t => t.isDone);
        }
        return <Grid item key={tl.id}>
            <Paper style={{padding: "20px"}} elevation={10}>
            <Todolist

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
            </Paper>
        </Grid>
    })

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar style={{justifyContent: "space-between"}}>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        Todolists
                    </Typography>
                    <Button color="inherit" variant={"outlined"}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px 0px"}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container spacing={5}>

                    {toDoListForRender}
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithReducer;
