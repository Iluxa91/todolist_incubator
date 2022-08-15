import React, {useCallback} from "react";
import {EditableSpan} from "../../components/EditableSpan";
import {Checkbox, IconButton} from "@material-ui/core";
import {HighlightOff} from "@material-ui/icons";
import {TaskStatuses, TaskType} from "../../API/todolistAPI";
import {useAppDispatch} from "../../store/hooks";
import {RequestStatusType} from "../../store/app-reducer";
import {removeTaskTC, updateTaskTC} from "../../store/tasks-reducer";


type TaskPropsType = {
    todolistId: string
    task: TaskType & { entityStatus: RequestStatusType }
    entityStatus: RequestStatusType
}

export const Task = React.memo((props: TaskPropsType) => {
    const dispatch = useAppDispatch()

    const onClickHandler = useCallback((taskId: string) => dispatch(removeTaskTC({
        todolistId: props.todolistId, taskId
    })), [dispatch, props.todolistId])

    const CheckBoxHandler = useCallback((status: TaskStatuses) => {
        dispatch(updateTaskTC(props.task.id, props.todolistId, {status}))
    }, [dispatch, props.task.id, props.todolistId])

    const changeTaskTitle = useCallback((title: string) => {
        dispatch(updateTaskTC(props.task.id, props.todolistId, {title}))
    }, [dispatch, props.task.id, props.todolistId])

    return <li key={props.task.id}>
        <Checkbox
            disabled={props.task.entityStatus === "loading"}
            checked={props.task.status === TaskStatuses.Completed}
            onChange={() => CheckBoxHandler(props.task.status === TaskStatuses.New ? TaskStatuses.Completed : TaskStatuses.New)}
            color={"primary"}
        />
        <EditableSpan
            title={props.task.title}
            setNewTitle={changeTaskTitle}
            disabled={props.entityStatus === "loading" || props.task.entityStatus === "loading"}
        />
        <IconButton
            disabled={props.task.entityStatus === "loading"}
            size={"small"}
            onClick={() => onClickHandler(props.task.id)}>
            <HighlightOff/></IconButton>
    </li>
})