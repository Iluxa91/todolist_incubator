import React, {useCallback} from "react";
import {AddItemForm} from "../../components/AddItemForm";
import {EditableSpan} from "../../components/EditableSpan";
import {Button, IconButton, List} from "@material-ui/core";
import {DeleteOutline} from "@material-ui/icons";
import {addTaskTC} from "../../store/tasks-reducer";
import {
    changeTodoListFilterAC,
    changeTodolistTitleTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType
} from "../../store/todolist-reducer";
import {Task} from "./Task";
import {TaskStatuses} from "../../API/todolistAPI";
import {useAppDispatch, useAppSelector} from "../../store/hooks";

type PropsType = {
    todolist: TodolistDomainType
    demo?: boolean
}

export const TodolistWithTasks = React.memo(({todolist, demo = false}: PropsType) => {
    let tasks = useAppSelector(state => state.tasks[todolist.id])
    const dispatch = useAppDispatch()

    if (todolist.filter === "active") {
        tasks = tasks.filter(t => t.status === TaskStatuses.New)
    }
    if (todolist.filter === "completed") {
        tasks = tasks.filter(t => t.status === TaskStatuses.Completed)
    }

    const addTask = useCallback((title: string) => {
        dispatch(addTaskTC({todolistId:todolist.id, title}))
    }, [dispatch, todolist.id])

    const changeFilterHandler = useCallback((filterValue: FilterValuesType) => {
        dispatch(changeTodoListFilterAC({filter: filterValue, id: todolist.id}))
    }, [dispatch, todolist.id])

    const changeTodoListTitle = useCallback((title: string) => {
        dispatch(changeTodolistTitleTC({todolistId: todolist.id,title: title}))
    }, [dispatch, todolist.id])

    const removeTodoList = useCallback(() => {
        dispatch(removeTodolistTC(todolist.id))
    }, [dispatch, todolist.id])

    return <div>
        <h3>
            <EditableSpan
                title={todolist.title}
                setNewTitle={changeTodoListTitle}
                disabled={todolist.entityStatus === "loading"}
            />
            <IconButton onClick={removeTodoList}
                        disabled={todolist.entityStatus === "loading"}>
                <DeleteOutline/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask} disabled={todolist.entityStatus === "loading"}/>
        <List>
            {
                tasks.map(t => <Task
                        task={t}
                        todolistId={todolist.id}
                        key={t.id}
                        entityStatus={todolist.entityStatus}
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
                color={todolist.filter === "completed" ? "secondary" : "primary"}
                variant={"contained"}
                disableElevation
                onClick={() => changeFilterHandler("completed")}>Completed
            </Button>
            <Button
                size={"small"}
                color={todolist.filter === "active" ? "secondary" : "primary"}
                variant={"contained"}
                disableElevation
                onClick={() => changeFilterHandler("active")}>Active
            </Button>
        </div>
    </div>
})
