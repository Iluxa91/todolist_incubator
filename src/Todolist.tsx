import React, {ChangeEvent, KeyboardEvent, useCallback, useContext, useState} from 'react';
import {FilterValuesType} from './App';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, Checkbox, IconButton, List} from "@material-ui/core";
import {DeleteOutline, HighlightOff} from "@material-ui/icons";

type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    toDoListId: string
    title: string
    tasks: Array<TaskType>
    filter: FilterValuesType
    removeTodoList: (toDoListId: string) => void
    removeTask: (taskId: string, toDoListId: string) => void
    changeTodoListFilter: (value: FilterValuesType, toDoListId: string) => void
    changeTodoListTitle: (title: string, toDoListId: string) => void
    addTask: (title: string, toDoListId: string) => void
    CheckBoxChange: (currentID: string, checkedValue: boolean, toDoListId: string) => void
    changeTaskTitle: (currentID: string, title: string, toDoListId: string) => void
}

export const Todolist = React.memo((props: PropsType) => {

    const addTask = useCallback((title: string) => {
        props.addTask(title, props.toDoListId)
    },[props])
    const changeFilterHandler = (filterValue: FilterValuesType) => {
        props.changeTodoListFilter(filterValue, props.toDoListId)
    }
    const changeTodoListTitle = (title: string) => {
        props.changeTodoListTitle(title, props.toDoListId)
    }
    const onClickHandler = (tID: string) => props.removeTask(tID, props.toDoListId)
    const removeTodoList = () => {
        props.removeTodoList(props.toDoListId)
    }

    return <div>
        <h3>
            <EditableSpan title={props.title} setNewTitle={changeTodoListTitle}/>
            <IconButton
                onClick={removeTodoList}><DeleteOutline/></IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <List>
            {
                props.tasks.map(t => {
                    const CheckBoxHandler = (checkedValue: boolean) => {
                        props.CheckBoxChange(t.id, checkedValue, props.toDoListId)
                    }
                    const changeTaskTitle = (title: string) => {
                        props.changeTaskTitle(t.id, title, props.toDoListId)
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

            {/*<Button name={'all'} onClick={() => changeFilterHandler('all')}*/}
            {/*        className={props.filter === 'all' ? styles.activeFilter : ''}*/}
            {/*        variant={"contained"}*/}
            {/*        disabled*/}
            {/*> all </Button>*/}
            <Button
                size={"small"}
                color={props.filter === "all" ? "secondary" : "primary"}
                variant={"contained"}
                disableElevation
                onClick={() => changeFilterHandler("all")}>All
            </Button>
            <Button
                size={"small"}
                color={props.filter === 'completed' ? "secondary" : "primary"}
                variant={"contained"}
                disableElevation
                onClick={() => changeFilterHandler("completed")}>Completed
            </Button>
            <Button
                size={"small"}
                color={props.filter === 'active' ? "secondary" : "primary"}
                variant={'contained'}
                disableElevation
                onClick={() => changeFilterHandler("active")}>Active
            </Button>

            {/*<Button name={'active'} onClick={() => changeFilterHandler('active')}*/}
            {/*        className={props.filter === 'active' ? styles.activeFilter : ''}>active </Button>*/}
            {/*<Button name={'completed'} onClick={() => changeFilterHandler('completed')}*/}
            {/*        className={props.filter === 'completed' ? styles.activeFilter : ''}>completed</Button>*/}
        </div>
    </div>
})
