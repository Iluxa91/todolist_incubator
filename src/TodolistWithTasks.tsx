import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValuesType} from './App';
import styles from './Todolist.module.css'
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton, List} from "@material-ui/core";
import {DeleteOutline, HighlightOff} from "@material-ui/icons";
import {TodolistType} from "./AppWithRedux";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./reducers/store";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./reducers/tasks-reducer";
import {ChangeTodoListFilterAC, ChangeTodoListTitleAC, removeTodoListAC} from "./reducers/todolist-reducer";

type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todolist: TodolistType
    // toDoListId: string
    // title: string
    // filter: FilterValuesType
    // tasks: Array<TaskType>
    // removeTodoList: (toDoListId: string) => void
    // removeTask: (taskId: string, toDoListId: string) => void
    // changeTodoListFilter: (value: FilterValuesType, toDoListId: string) => void
    // changeTodoListTitle: (title: string, toDoListId: string) => void
    // addTask: (title: string, toDoListId: string) => void
    // CheckBoxChange: (currentID: string, checkedValue: boolean, toDoListId: string) => void
    // changeTaskTitle: (currentID: string, title: string, toDoListId: string) => void
}

export function TodolistWithTasks({todolist}: PropsType) {
    let tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[todolist.id])

    if (todolist.filter === 'active') {
        tasks = tasks.filter(t => t.isDone === false)
    }
    if (todolist.filter === 'completed') {
        tasks = tasks.filter(t => t.isDone === true)
    }
    const dispatch = useDispatch()
    const addTask = (title: string) => {
        dispatch(addTaskAC(title, todolist.id))
    }
    const changeFilterHandler = (filterValue: FilterValuesType) => {
        dispatch(ChangeTodoListFilterAC(filterValue, todolist.id))
    }
    const changeTodoListTitle = (title: string) => {
        dispatch(ChangeTodoListTitleAC(title, todolist.id))
    }
    const onClickHandler = (tID: string) => dispatch(removeTaskAC(tID, todolist.id))
    const removeTodoList = () => {
        dispatch(removeTodoListAC(todolist.id))
    }

    return <div>
        <h3>
            <EditableSpan title={todolist.title} setNewTitle={changeTodoListTitle}/>
            <IconButton
                onClick={removeTodoList}><DeleteOutline/></IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <List>
            {
                tasks.map(t => {
                    const CheckBoxHandler = (checkedValue: boolean) => {
                        dispatch(changeTaskStatusAC(t.id, checkedValue, todolist.id))
                    }
                    const changeTaskTitle = (title: string) => {
                        dispatch(changeTaskTitleAC(t.id, title, todolist.id))
                    }
                    return <li key={t.id}>
                        <Checkbox
                            checked={t.isDone}
                            onChange={() => CheckBoxHandler(!t.isDone)}
                            color={'primary'}
                        />
                        <EditableSpan title={t.title} setNewTitle={changeTaskTitle}/>
                        {/*<span>{t.title}</span>*/}
                        <IconButton
                            size={'small'}
                            onClick={() => onClickHandler(t.id)}><HighlightOff/></IconButton>
                    </li>
                })
            }
        </List>
        <div>
            <Button
                size={"small"}
                color={todolist.filter === "all" ? "secondary" : "primary"}
                variant={"contained"}
                disableElevation
                onClick={() => changeFilterHandler("all")}>All
            </Button>
            <Button
                size={"small"}
                color={todolist.filter === 'completed' ? "secondary" : "primary"}
                variant={"contained"}
                disableElevation
                onClick={() => changeFilterHandler("completed")}>Completed
            </Button>
            <Button
                size={"small"}
                color={todolist.filter === 'active' ? "secondary" : "primary"}
                variant={'contained'}
                disableElevation
                onClick={() => changeFilterHandler("active")}>Active
            </Button>
        </div>
    </div>
}