import {TaskStateType} from "../AppWithRedux";
import {v1} from "uuid";
import {
    ActionType,
    AddTodoListAC,
    ChangeTodoListFilterAC, ChangeTodoListTitleAC, FilterValuesType,
    removeTodoListAC, TodolistDomainType,
    todoListsReducer
} from "./todolist-reducer";
import {tasksReducer} from "./tasks-reducer";

let todolistId1 = v1()
let todolistId2 = v1()
let startState: Array<TodolistDomainType>

beforeEach(()=>{
    startState = [
    {id: todolistId1, title: 'What to learn', filter: 'all', order:0, addedDate:''},
    {id: todolistId2, title: 'What to buy', filter: "all", order:0, addedDate:''}
]
})

test('correct todolist should be removed', () => {
    // let todolistId1 = v1()
    // let todolistId2 = v1()
    //
    // const startState: Array<TodolistType> = [
    //     {id: todolistId1, title: 'What to learn', filter: 'all'},
    //     {id: todolistId2, title: 'What to buy', filter: 'all'}
    // ]

    const endState = todoListsReducer(startState, removeTodoListAC(todolistId1))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
    // let todolistId1 = v1();
    // let todolistId2 = v1();

    let newTodolistTitle = "New Todolist";

    // const startState: Array<TodolistType> = [
    //     {id: todolistId1, title: "What to learn", filter: "all"},
    //     {id: todolistId2, title: "What to buy", filter: "all"}
    // ]
    const endState = todoListsReducer(startState, AddTodoListAC(newTodolistTitle))

    expect(endState.length).toBe(3);
    expect(endState[2].title).toBe(newTodolistTitle);
});
test('correct todolist should change its name', () => {
    // let todolistId1 = v1()
    // let todolistId2 = v1()
    let newTodolistTitle = 'New Todolist'
    // const startState: Array<TodolistType> = [
    //     {id: todolistId1, title: 'What to learn', filter: 'all'},
    //     {id: todolistId2, title: 'What to buy', filter: 'all'}]
    // const action: ActionType = {
    //     type: 'CHANGE-TODOLIST-TITLE',
    //     id: todolistId2,
    //     title: newTodolistTitle}
    const endState = todoListsReducer(startState, ChangeTodoListTitleAC(newTodolistTitle,todolistId2))

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {
    // let todolistId1 = v1()
    // let todolistId2 = v1()
    let newFilter: FilterValuesType = 'completed'
    // const startState: Array<TodolistType> = [
    //     {id: todolistId1, title: 'What to learn', filter: 'all'},
    //     {id: todolistId2, title: 'What to buy', filter: 'all'}
    // ]
    // const action: ActionType = {
    //     type: 'CHANGE-TODOLIST-FILTER',
    //     id: todolistId2,
    //     filter: newFilter
    // }
    const endState = todoListsReducer(startState, ChangeTodoListFilterAC(newFilter,todolistId2))
    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe(newFilter)
})

test('ids should be equals', () => {
    const startTasksState: TaskStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    const action = AddTodoListAC("new todolist");

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todoListsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.todolistId);
    expect(idFromTodolists).toBe(action.todolistId);
});
