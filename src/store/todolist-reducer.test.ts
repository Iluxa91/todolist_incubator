import {v1} from "uuid";
import {
    addTodolistTC,
    changeTodolistEntityStatusAC,
    changeTodoListFilterAC, changeTodolistTitleTC,
    fetchTodolistsTC,
    FilterValuesType, removeTodolistTC,
    TodolistDomainType,
    todoListsReducer
} from "./todolist-reducer";
import {
    TaskDomainStateType,
    tasksReducer
} from "./tasks-reducer";
import {RequestStatusType} from "./app-reducer";

let todolistId1 = v1()
let todolistId2 = v1()
let startState: Array<TodolistDomainType>

beforeEach(() => {
    startState = [
        {
            id: todolistId1,
            title: "What to learn",
            filter: "all",
            order: 0,
            addedDate: "",
            entityStatus: "idle"
        },
        {
            id: todolistId2,
            title: "What to buy",
            filter: "all",
            order: 0,
            addedDate: "",
            entityStatus: "idle"
        }
    ]
})

test("correct todolist should be removed", () => {
    const endState = todoListsReducer(startState, removeTodolistTC.fulfilled({id: todolistId1}, "requestId", todolistId1))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test("correct todolist should be added", () => {

    let newTodolistTitle = "New Todolist";

    let payload = {
        todolist: {
            id: todolistId1,
            title: newTodolistTitle,
            order: 0,
            addedDate: ""
        }
    };
    const endState = todoListsReducer(startState, addTodolistTC.fulfilled(payload, "requestId", "New Todolist"))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodolistTitle);
});

test("correct todolist should change its name", () => {

    let newTodolistTitle = "New Todolist"

    let payload = {
        title:
        newTodolistTitle, id: todolistId2
    };
    const endState = todoListsReducer(startState, changeTodolistTitleTC.fulfilled(payload, "requestId", {
        title: "New Todolist",
        todolistId: todolistId2
    }))

    expect(endState[0].title).toBe("What to learn")
    expect(endState[1].title).toBe(newTodolistTitle)
})

test("correct filter of todolist should be changed", () => {

    let newFilter: FilterValuesType = "completed"

    const endState = todoListsReducer(startState, changeTodoListFilterAC({
        filter: newFilter,
        id: todolistId2
    }))
    expect(endState[0].filter).toBe("all")
    expect(endState[1].filter).toBe(newFilter)
})

test("ids should be equals", () => {
    const startTasksState: TaskDomainStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    let payload = {
        todolist: {
            id: todolistId1,
            title: "What to learn",
            order: 0,
            addedDate: ""
        }
    };
    const action = addTodolistTC.fulfilled(payload, "requestId", "What to learn");

    const endTasksState = tasksReducer(startTasksState, action);
    const endTodolistsState = todoListsReducer(startTodolistsState, action);

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});

test("todolists should be added", () => {

    const action = fetchTodolistsTC.fulfilled({todolists: startState}, "requestID");
    const endState = todoListsReducer([], action);
    expect(endState.length).toBe(2)

})

test("correct entity status of todolist should be changed", () => {
    let newStatus: RequestStatusType = "loading";

    const action = changeTodolistEntityStatusAC({
        todolistId: todolistId2,
        status: newStatus
    })
    const endState = todoListsReducer(startState, action);
    expect(endState[0].entityStatus).toBe("idle");
    expect(endState[1].entityStatus).toBe(newStatus)

})
