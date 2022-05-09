import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {FilterValuesType} from './App';
import styles from './Todolist.module.css'
import {Button} from "./components/Button";
import {CheckBox} from "./components/CheckBox";
import {AddItemForm} from "./AddItemForm";
import {EditableSpan} from "./EditableSpan";

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

export function Todolist(props: PropsType) {

    const addTask = (title: string) => {
        props.addTask(title, props.toDoListId)
    }
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
            <button onClick={removeTodoList}>x</button>
        </h3>
        <AddItemForm addItem={addTask}/>
        <ul>
            {
                props.tasks.map(t => {
                    const CheckBoxHandler = (checkedValue: boolean) => {
                        props.CheckBoxChange(t.id, checkedValue, props.toDoListId)
                    }
                    const changeTaskTitle = (title: string) => {
                        props.changeTaskTitle(t.id, title, props.toDoListId)
                    }
                    return <li key={t.id}>
                        <CheckBox isDone={t.isDone} callBack={CheckBoxHandler}/>
                        <EditableSpan title={t.title} setNewTitle={changeTaskTitle}/>
                        {/*<span>{t.title}</span>*/}
                        <button onClick={() => onClickHandler(t.id)}>x</button>
                    </li>
                })
            }
        </ul>
        <div>

            <Button name={'all'} callBack={() => changeFilterHandler('all')}
                    className={props.filter === 'all' ? styles.activeFilter : ''}/>
            <Button name={'active'} callBack={() => changeFilterHandler('active')}
                    className={props.filter === 'active' ? styles.activeFilter : ''}/>
            <Button name={'completed'} callBack={() => changeFilterHandler('completed')}
                    className={props.filter === 'completed' ? styles.activeFilter : ''}/>
        </div>
    </div>
}
