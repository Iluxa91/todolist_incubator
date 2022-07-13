import {TaskStateType} from "../App/AppWithRedux";
import {v1} from "uuid";
import {
    addTodoListAC,
    changeTodoListFilterAC, changeTodoListTitleAC, FilterValuesType,
    removeTodoListAC, TodolistDomainType,
    todoListsReducer
} from "./todolist-reducer";
import {tasksReducer} from "./tasks-reducer";

let todolistId1 = v1()
let todolistId2 = v1()
let startState: Array<TodolistDomainType>

beforeEach(()=>{
    startState = [
    {id: todolistId1, title: 'What to learn', filter: 'all', order:0, addedDate:'',entityStatus:'idle'},
    {id: todolistId2, title: 'What to buy', filter: "all", order:0, addedDate:'',entityStatus:'idle'}
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
    const endState = todoListsReducer(startState, addTodoListAC({id: todolistId1, title: newTodolistTitle, order:0, addedDate:''}))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodolistTitle);
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
    const endState = todoListsReducer(startState, changeTodoListTitleAC(newTodolistTitle,todolistId2))

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
    const endState = todoListsReducer(startState, changeTodoListFilterAC(newFilter,todolistId2))
    expect(endState[0].filter).toBe('all')
    expect(endState[1].filter).toBe(newFilter)
})

test('ids should be equals', () => {
    const startTasksState: TaskStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    const action = addTodoListAC({id: todolistId1, title: 'What to learn', order:0, addedDate:''});

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todoListsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.todolist.id);
    expect(idFromTodolists).toBe(action.todolist.id);
});
