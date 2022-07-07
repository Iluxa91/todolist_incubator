import {
    removeTaskTC,
    updateTaskTC
} from "../Store/tasks-reducer";
import React, {useCallback} from "react";
import {EditableSpan} from "../components/EditableSpan";
import {Checkbox, IconButton} from "@material-ui/core";
import {HighlightOff} from "@material-ui/icons";
import {TaskStatuses, TaskType} from "../API/todolistAPI";
import {useAppDispatch} from "../Store/hooks";

type TaskPropsType = {
    // onClickHandler: (id: string) => void
    todolistId: string
    task: TaskType
}

export const Task = React.memo((props: TaskPropsType) => {
    console.log('task called')
    const dispatch = useAppDispatch()

    const onClickHandler = useCallback((tID: string) => dispatch(removeTaskTC(props.todolistId,tID)), [dispatch, props.todolistId])

    const CheckBoxHandler = useCallback((status: TaskStatuses) => {
        dispatch(updateTaskTC(props.task.id, props.todolistId, {status}))
    }, [dispatch, props.task.id, props.todolistId])

    const changeTaskTitle = useCallback((title: string) => {
        dispatch(updateTaskTC(props.task.id, props.todolistId, {title}))
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