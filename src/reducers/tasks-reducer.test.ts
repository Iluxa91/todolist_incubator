import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from './tasks-reducer';
import {TaskStateType} from '../AppWithRedux';
import {AddTodoListAC, removeTodoListAC, TodolistDomainType, todoListsReducer} from "./todolist-reducer";
import {TaskPriorities, TaskStatuses} from "../API/todolistAPI";

let startState:TaskStateType

beforeEach(()=>{
    startState = {
        "todolistId1": [
            { id: "1", title: "CSS", status: TaskStatuses.New, todoListId:"todolistId1", addedDate:'', deadline:'', description:'', order: 0, startDate:'', priority:TaskPriorities.Low },
            { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId:"todolistId1", addedDate:'', deadline:'', description:'', order: 0, startDate:'', priority:TaskPriorities.Low },
            { id: "3", title: "React", status: TaskStatuses.New, todoListId:"todolistId1", addedDate:'', deadline:'', description:'', order: 0, startDate:'', priority:TaskPriorities.Low }
        ],
        "todolistId2": [
            { id: "1", title: "bread", status: TaskStatuses.New, todoListId:"todolistId2", addedDate:'', deadline:'', description:'', order: 0, startDate:'', priority:TaskPriorities.Low },
            { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId:"todolistId2", addedDate:'', deadline:'', description:'', order: 0, startDate:'', priority:TaskPriorities.Low },
            { id: "3", title: "tea", status: TaskStatuses.New, todoListId:"todolistId2", addedDate:'', deadline:'', description:'', order: 0, startDate:'', priority:TaskPriorities.Low }
        ]
    }
})


test('correct task should be deleted from correct array', () => {
    // const startState: TaskStateType = {
    //     "todolistId1": [
    //         { id: "1", title: "CSS", isDone: false },
    //         { id: "2", title: "JS", isDone: true },
    //         { id: "3", title: "React", isDone: false }
    //     ],
    //     "todolistId2": [
    //         { id: "1", title: "bread", isDone: false },
    //         { id: "2", title: "milk", isDone: true },
    //         { id: "3", title: "tea", isDone: false }
    //     ]
    // };

    const action = removeTaskAC("2", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        "todolistId1": [
            { id: "1", title: "CSS", status: TaskStatuses.New, todoListId:"todolistId1", addedDate:'', deadline:'', description:'', order: 0, startDate:'', priority:TaskPriorities.Low },
            { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId:"todolistId1", addedDate:'', deadline:'', description:'', order: 0, startDate:'', priority:TaskPriorities.Low },
            { id: "3", title: "React", status: TaskStatuses.New, todoListId:"todolistId1", addedDate:'', deadline:'', description:'', order: 0, startDate:'', priority:TaskPriorities.Low }
        ],
        "todolistId2": [
            { id: "1", title: "bread", status: TaskStatuses.New, todoListId:"todolistId2", addedDate:'', deadline:'', description:'', order: 0, startDate:'', priority:TaskPriorities.Low },
            { id: "3", title: "tea", status: TaskStatuses.New, todoListId:"todolistId2", addedDate:'', deadline:'', description:'', order: 0, startDate:'', priority:TaskPriorities.Low }
        ]
    });
});

test('correct task should be added to correct array', () => {
    // const startState: TaskStateType = {
    //     "todolistId1": [
    //         { id: "1", title: "CSS", isDone: false },
    //         { id: "2", title: "JS", isDone: true },
    //         { id: "3", title: "React", isDone: false }
    //     ],
    //     "todolistId2": [
    //         { id: "1", title: "bread", isDone: false },
    //         { id: "2", title: "milk", isDone: true },
    //         { id: "3", title: "tea", isDone: false }
    //     ]
    // };

    const action = addTaskAC("juce", "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("juce");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
})

test('status of specified task should be changed', () => {
    // const startState: TaskStateType = {
    //     "todolistId1": [
    //         { id: "1", title: "CSS", isDone: false },
    //         { id: "2", title: "JS", isDone: true },
    //         { id: "3", title: "React", isDone: false }
    //     ],
    //     "todolistId2": [
    //         { id: "1", title: "bread", isDone: false },
    //         { id: "2", title: "milk", isDone: true },
    //         { id: "3", title: "tea", isDone: false }
    //     ]
    // };

    const action = changeTaskStatusAC("2", TaskStatuses.New, "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
    expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
});

test('title of specified task should be changed', () => {
    // const startState: TaskStateType = {
    //     "todolistId1": [
    //         { id: "1", title: "CSS", isDone: false },
    //         { id: "2", title: "JS", isDone: true },
    //         { id: "3", title: "React", isDone: false }
    //     ],
    //     "todolistId2": [
    //         { id: "1", title: "bread", isDone: false },
    //         { id: "2", title: "milk", isDone: true },
    //         { id: "3", title: "tea", isDone: false }
    //     ]
    // };

    const action = changeTaskTitleAC("2", 'cheese', "todolistId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].title).toBe('cheese');
    expect(endState["todolistId1"][1].title).toBe("JS");
});



test('new array should be added when new todolist is added', () => {
    // const startState: TaskStateType = {
    //     "todolistId1": [
    //         { id: "1", title: "CSS", isDone: false },
    //         { id: "2", title: "JS", isDone: true },
    //         { id: "3", title: "React", isDone: false }
    //     ],
    //     "todolistId2": [
    //         { id: "1", title: "bread", isDone: false },
    //         { id: "2", title: "milk", isDone: true },
    //         { id: "3", title: "tea", isDone: false }
    //     ]
    // };

    const action = AddTodoListAC("new todolist");
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }
    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

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

test('property with todolistId should be deleted', () => {
    // const startState: TaskStateType = {
    //     "todolistId1": [
    //         { id: "1", title: "CSS", isDone: false },
    //         { id: "2", title: "JS", isDone: true },
    //         { id: "3", title: "React", isDone: false }
    //     ],
    //     "todolistId2": [
    //         { id: "1", title: "bread", isDone: false },
    //         { id: "2", title: "milk", isDone: true },
    //         { id: "3", title: "tea", isDone: false }
    //     ]
    // };

    const action = removeTodoListAC("todolistId2");
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});










