import React, {useCallback} from 'react';
import './App.css';
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from '@material-ui/core';
import {Menu} from "@material-ui/icons";
import {AddTodoListAC} from "./reducers/todolist-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./reducers/store";
import {TodolistWithTasks} from "./TodolistWithTasks";

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}
// export type TaskStateType = {
//     [todoListId: string]: Array<TaskType>
// }
function AppWithRedux() {

    let todoLists = useSelector<AppRootStateType, Array<TodolistType>>(state => state.todolists)
    // let tasks = useSelector<AppRootStateType, TaskStateType>(state => state.tasks)
    let dispatch = useDispatch()

    // const removeTask = useCallback((id: string, todoListId: string) => {
    //     dispatch(removeTaskAC(id, todoListId))
    // },[dispatch])
    //
    // const addTask = useCallback((title: string, todoListId: string) => {
    //     dispatch(addTaskAC(title, todoListId))
    // },[dispatch])
    //
    // const CheckBoxChange = useCallback((currentID: string, isDone: boolean, toDoListId: string) => {
    //     dispatch(changeTaskStatusAC(currentID, isDone, toDoListId))
    // },[dispatch])
    // const changeTaskTitle = useCallback((currentID: string, title: string, toDoListId: string) => {
    //     dispatch(changeTaskTitleAC(currentID, title, toDoListId))
    // },[dispatch])
    // const removeTodoList = useCallback((todoListId: string) => {
    //     let action = removeTodoListAC(todoListId)
    //     dispatch(action)
    // },[dispatch])
    const addTodoList = useCallback((title: string) => {
        dispatch(AddTodoListAC(title))
    },[dispatch])

    // const changeTodoListFilter = useCallback((filter: FilterValuesType, todoListId: string) => {
    //     dispatch(ChangeTodoListFilterAC(filter, todoListId))
    // },[dispatch])
    //
    // const changeTodoListTitle = useCallback((title: string, todoListId: string) => {
    //     dispatch(ChangeTodoListTitleAC(title, todoListId))
    // },[dispatch])

    const toDoListForRender = todoLists.map(tl => {

        // let tasksForTodolist = tasks[tl.id];
        //
        // if (tl.filter === "active") {
        //     tasksForTodolist = tasksForTodolist.filter(t => !t.isDone);
        // }
        // if (tl.filter === "completed") {
        //     tasksForTodolist = tasksForTodolist.filter(t => t.isDone);
        // }
        return <Grid item key={tl.id}>
            <Paper style={{padding: "20px"}} elevation={10}>
                <TodolistWithTasks
                    todolist={tl}
                    // title={tl.title}
                    // filter={tl.filter}
                    // toDoListId={tl.id}
                    // tasks={tasksForTodolist}
                    // removeTask={removeTask}
                    // changeTodoListFilter={changeTodoListFilter}
                    // changeTodoListTitle={changeTodoListTitle}
                    // addTask={addTask}
                    // CheckBoxChange={CheckBoxChange}
                    // changeTaskTitle={changeTaskTitle}
                    // removeTodoList={removeTodoList}
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

export default AppWithRedux;
