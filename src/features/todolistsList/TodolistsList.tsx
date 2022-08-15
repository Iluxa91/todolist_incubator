import React, {useCallback, useEffect} from "react";
import {Container, Grid, Paper} from "@material-ui/core";
import {AddItemForm} from "../../components/AddItemForm";
import {TodolistWithTasks} from "./TodolistWithTasks";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {addTodolistTC, fetchTodolistsTC} from "../../store/todolist-reducer";
import {Navigate} from "react-router-dom";

type PropsType = {
    demo?: boolean
}
export const TodolistsList = ({demo = false}: PropsType) => {

    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const todoLists = useAppSelector(state => state.todolists)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return
        }
        dispatch(fetchTodolistsTC())
    }, [])

    const addTodoList = useCallback((title: string) => {
        dispatch(addTodolistTC(title))
    }, [dispatch])

    const toDoListForRender = todoLists.map(tl => {
        return <Grid item key={tl.id}>
            <Paper style={{padding: "20px"}} elevation={10}>
                <TodolistWithTasks todolist={tl} demo={demo}/>
            </Paper>
        </Grid>
    })

    if (!isLoggedIn) {
        return <Navigate to={"/login"}/>
    }
    return (
        <div>
            <Container fixed>
                <Grid container justifyContent={"center"} style={{padding: "20px 0px"}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container justifyContent={"center"} spacing={5}>
                    {toDoListForRender}
                </Grid>
            </Container>
        </div>
    );
};