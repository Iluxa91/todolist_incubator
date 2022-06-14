import {changeTaskStatusAC, changeTaskTitleAC} from "./reducers/tasks-reducer";
import React, {useCallback} from "react";
import {useDispatch} from "react-redux";
import {EditableSpan} from "./EditableSpan";
import {Checkbox, IconButton} from "@material-ui/core";
import {HighlightOff} from "@material-ui/icons";
import {TaskType} from "./TodolistWithTasks";

type TaskPropsType = {
    onClickHandler: (id: string) => void
    todolistId: string
    task: TaskType

}

export const Task = React.memo((props: TaskPropsType) => {
    console.log('task called')
    const dispatch = useDispatch()
    const CheckBoxHandler = useCallback((checkedValue: boolean) => {
        dispatch(changeTaskStatusAC(props.task.id, checkedValue, props.todolistId))
    }, [dispatch, props.task.id, props.todolistId])
    const changeTaskTitle = useCallback((title: string) => {
        dispatch(changeTaskTitleAC(props.task.id, title, props.todolistId))
    }, [dispatch, props.task.id, props.todolistId])
    return <li key={props.task.id}>
        <Checkbox
            checked={props.task.isDone}
            onChange={() => CheckBoxHandler(!props.task.isDone)}
            color={'primary'}
        />
        <EditableSpan title={props.task.title} setNewTitle={changeTaskTitle}/>
        {/*<span>{t.title}</span>*/}
        <IconButton
            size={'small'}
            onClick={() => props.onClickHandler(props.task.id)}><HighlightOff/></IconButton>
    </li>
})