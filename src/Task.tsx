import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "./reducers/tasks-reducer";
import React, {useCallback} from "react";
import {useDispatch} from "react-redux";
import {EditableSpan} from "./EditableSpan";
import {Checkbox, IconButton} from "@material-ui/core";
import {HighlightOff} from "@material-ui/icons";
import {TaskStatuses, TaskType} from "./API/todolistAPI";

type TaskPropsType = {
    // onClickHandler: (id: string) => void
    todolistId: string
    task: TaskType
}

export const Task = React.memo((props: TaskPropsType) => {
    console.log('task called')
    const dispatch = useDispatch()
    const onClickHandler = useCallback((tID: string) => dispatch(removeTaskAC(tID, props.todolistId)), [dispatch, props.todolistId])
    const CheckBoxHandler = useCallback((status: TaskStatuses) => {
        dispatch(changeTaskStatusAC(props.task.id, status, props.todolistId))
    }, [dispatch, props.task.id, props.todolistId])
    const changeTaskTitle = useCallback((title: string) => {
        dispatch(changeTaskTitleAC(props.task.id, title, props.todolistId))
    }, [dispatch, props.task.id, props.todolistId])
    return <li key={props.task.id}>
        <Checkbox
            checked={props.task.status===TaskStatuses.Completed}
            onChange={() => CheckBoxHandler(props.task.status===TaskStatuses.New?TaskStatuses.Completed:TaskStatuses.New)}
            color={'primary'}
        />
        <EditableSpan title={props.task.title} setNewTitle={changeTaskTitle}/>
        {/*<span>{t.title}</span>*/}
        <IconButton
            size={'small'}
            // onClick={() => props.onClickHandler(props.task.id)}
            onClick={()=>onClickHandler(props.task.id)}>
            <HighlightOff/></IconButton>
    </li>
})