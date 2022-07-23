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
import {addTodolistTC, fetchTodolistsTC,} from "../store/todolist-reducer";
import {TodolistWithTasks} from "../features/todolistsList/TodolistWithTasks";
import {TaskType} from "../API/todolistAPI";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {ErrorSnackbar} from "../components/ErrorSnackbar";
import {Navigate, Route, Routes} from 'react-router-dom';
import {Login} from "../features/login/Login";
import {TodolistsList} from "../features/todolistsList/TodolistsList";
import {initializeAppTC} from "../store/app-reducer";
import {CircularProgress} from "@mui/material";
import {logoutTC} from "../store/authReducer";


export type TaskStateType = {
    [todoListId: string]: Array<TaskType>
}
type PropsType = {
    demo?: boolean
}

function AppWithRedux({demo = false}: PropsType) {

    const isInitialized = useAppSelector(state => state.app.isInizialized)
    const isLoggedIn = useAppSelector(state=>state.auth.isLoggedIn)
    const status = useAppSelector(state => state.app.status)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo) {
            return
        }
        dispatch(initializeAppTC())
    }, [])
    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }
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
                    {isLoggedIn && <Button color="inherit" variant={"outlined"} onClick={()=>dispatch(logoutTC())}>Log out</Button>}
                </Toolbar>
                {status === 'loading' && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path='/' element={<TodolistsList demo={demo}/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='*' element={<Navigate to='/404'/>}/>
                    <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>}/>
                </Routes>
            </Container>


        </div>
    );
}

export default AppWithRedux;
