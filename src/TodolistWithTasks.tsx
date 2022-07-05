import React, {useCallback} from 'react';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, IconButton, List} from "@material-ui/core";
import {DeleteOutline} from "@material-ui/icons";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./reducers/store";
import {addTaskAC} from "./reducers/tasks-reducer";
import {
    ChangeTodoListFilterAC,
    ChangeTodoListTitleAC,
    FilterValuesType,
    removeTodoListAC, TodolistDomainType
} from "./reducers/todolist-reducer";
import {Task} from "./Task";
import {TaskStatuses, TaskType} from "./API/todolistAPI";

type PropsType = {
    todolist: TodolistDomainType
}

export const TodolistWithTasks = React.memo(({todolist}: PropsType) => {
    console.log('todolist called')
    let tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[todolist.id])

    if (todolist.filter === 'active') {
        tasks = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (todolist.filter === 'completed') {
        tasks = tasks.filter(t => t.status === TaskStatuses.Completed)
    }
    const dispatch = useDispatch()
    const addTask = useCallback((title: string) => {
        dispatch(addTaskAC(title, todolist.id))
    }, [dispatch, todolist.id])
    const changeFilterHandler = useCallback((filterValue: FilterValuesType) => {
        dispatch(ChangeTodoListFilterAC(filterValue, todolist.id))
    }, [dispatch, todolist.id])
    const changeTodoListTitle = useCallback((title: string) => {
        dispatch(ChangeTodoListTitleAC(title, todolist.id))
    }, [dispatch, todolist.id])
    // const onClickHandler = useCallback((tID: string) => dispatch(removeTaskAC(tID, todolist.id)), [dispatch, todolist.id])
    const removeTodoList = useCallback(() => {
        dispatch(removeTodoListAC(todolist.id))
    }, [dispatch, todolist.id])

    return <div>
        <h3>
            <EditableSpan title={todolist.title} setNewTitle={changeTodoListTitle}/>
            <IconButton
                onClick={removeTodoList}><DeleteOutline/></IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <List>
            {
                tasks.map(t => <Task
                        // onClickHandler={onClickHandler}
                        task={t}
                        todolistId={todolist.id}
                        key={t.id}
                    />
                )
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
})
