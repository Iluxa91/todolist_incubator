import React, {useCallback, useEffect} from 'react';
import s from './App.module.css';
import {AddItemForm} from "../components/AddItemForm";
import {
    AppBar,
    Button,
    Container,
    Grid,
    IconButton,
    LinearProgress,
    Paper,
    Toolbar,
    Typography
} from '@material-ui/core';
import {Menu} from "@material-ui/icons";
import {
    addTodolistTC,
    fetchTodolistsTC,
} from "../Store/todolist-reducer";
import {TodolistWithTasks} from "../Todolists/TodolistWithTasks";
import {TaskType} from "../API/todolistAPI";
import {useAppDispatch, useAppSelector} from "../Store/hooks";
import {ErrorSnackbar} from "../components/ErrorSnackbar";

export type TaskStateType = {
    [todoListId: string]: Array<TaskType>
}

function AppWithRedux() {
    let todoLists = useAppSelector(state => state.todolists)
    let status = useAppSelector(state=>state.app.status)
    let dispatch = useAppDispatch()

    const addTodoList = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])

    const toDoListForRender = todoLists.map(tl => {

        return <Grid item key={tl.id}>
            <Paper style={{padding: "20px"}} elevation={10}>
                <TodolistWithTasks todolist={tl}/>
            </Paper>
        </Grid>
    })

    useEffect(() => {
        dispatch(fetchTodolistsTC())
    },[])

    return (
        <div className={s.appContainer}>
            <ErrorSnackbar/>
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
                {status==='loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px 0px"}}>
                    <AddItemForm addItem={addTodoList} />
                </Grid>
                <Grid container spacing={5}>
                    {toDoListForRender}
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithRedux;
