import {changeTaskStatusAC, changeTaskTitleAC} from "./reducers/tasks-reducer";
import React, {useCallback} from "react";
import {useDispatch} from "react-redux";
import {EditableSpan} from "./EditableSpan";
import {Checkbox, IconButton} from "@material-ui/core";
import {HighlightOff} from "@material-ui/icons";
import {TaskType} from "./TodolistWithTasks";

type TaskPropsType = {
    onClickHandler:(id:string)=>void
    todolistId:string
    task:TaskType
    taskId:string
    isDone:boolean
    taskTitle:string
}

export const Task = React.memo((props:TaskPropsType) => {
    console.log('task called')
    const dispatch = useDispatch()
    const CheckBoxHandler = (checkedValue: boolean) => {
        dispatch(changeTaskStatusAC(props.taskId, checkedValue, props.todolistId))
    }
    const changeTaskTitle = useCallback((title: string) => {
        dispatch(changeTaskTitleAC(props.taskId, title, props.todolistId))
    }, [dispatch, props.taskId, props.todolistId])
    return <li key={props.taskId}>
        <Checkbox
            checked={props.isDone}
            onChange={() => CheckBoxHandler(!props.isDone)}
            color={'primary'}
        />
        <EditableSpan title={props.taskTitle} setNewTitle={changeTaskTitle}/>
        {/*<span>{t.title}</span>*/}
        <IconButton
            size={'small'}
            onClick={() => props.onClickHandler(props.taskId)}><HighlightOff/></IconButton>
    </li>
})