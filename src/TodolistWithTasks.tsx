import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";
import {Button, IconButton, List} from "@material-ui/core";
import {DeleteOutline} from "@material-ui/icons";
import {addTaskAC, addTaskTC, fetchTasksTC} from "./Store/tasks-reducer";
import {
    ChangeTodoListFilterAC,
    ChangeTodoListTitleAC, changeTodolistTitleTC,
    FilterValuesType,
    removeTodoListAC, removeTodolistTC, TodolistDomainType
} from "./Store/todolist-reducer";
import {Task} from "./Task";
import {TaskStatuses} from "./API/todolistAPI";
import {useAppDispatch, useAppSelector} from "./Store/hooks";

type PropsType = {
    todolist: TodolistDomainType
}

export const TodolistWithTasks = React.memo(({todolist}: PropsType) => {
    console.log('todolist called')
    let tasks = useAppSelector(state => state.tasks[todolist.id])
    const dispatch = useAppDispatch()


    if (todolist.filter === 'active') {
        tasks = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (todolist.filter === 'completed') {
        tasks = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    const addTask = useCallback((title: string) => {
        dispatch(addTaskTC(todolist.id, title))
    }, [dispatch, todolist.id])

    const changeFilterHandler = useCallback((filterValue: FilterValuesType) => {
        dispatch(ChangeTodoListFilterAC(filterValue, todolist.id))
    }, [dispatch, todolist.id])

    const changeTodoListTitle = useCallback((title: string) => {
        dispatch(changeTodolistTitleTC(todolist.id, title))
    }, [dispatch, todolist.id])
    // const onClickHandler = useCallback((tID: string) => dispatch(removeTaskAC(tID, todolist.id)), [dispatch, todolist.id])

    const removeTodoList = useCallback(() => {
        dispatch(removeTodolistTC(todolist.id))
    }, [dispatch, todolist.id])

    useEffect(()=>{
        dispatch(fetchTasksTC(todolist.id))
    },[])

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
