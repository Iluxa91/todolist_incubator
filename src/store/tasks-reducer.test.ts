import {
    addTaskAC,
    removeTaskAC, setTasksAC,
    TaskDomainStateType,
    tasksReducer,
    updateTaskAC
} from "./tasks-reducer";
import {
    addTodoListAC,
    removeTodoListAC, setTodolistsAC,
    TodolistDomainType,
    todoListsReducer
} from "./todolist-reducer";
import {TaskPriorities, TaskStatuses} from "../API/todolistAPI";

let startState: TaskDomainStateType

beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: TaskStatuses.New,
                todoListId: "todolistId1",
                addedDate: "",
                deadline: "",
                description: "",
                order: 0,
                startDate: "",
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            },
            {
                id: "2",
                title: "JS",
                status: TaskStatuses.Completed,
                todoListId: "todolistId1",
                addedDate: "",
                deadline: "",
                description: "",
                order: 0,
                startDate: "",
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            },
            {
                id: "3",
                title: "React",
                status: TaskStatuses.New,
                todoListId: "todolistId1",
                addedDate: "",
                deadline: "",
                description: "",
                order: 0,
                startDate: "",
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                status: TaskStatuses.New,
                todoListId: "todolistId2",
                addedDate: "",
                deadline: "",
                description: "",
                order: 0,
                startDate: "",
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            },
            {
                id: "2",
                title: "milk",
                status: TaskStatuses.Completed,
                todoListId: "todolistId2",
                addedDate: "",
                deadline: "",
                description: "",
                order: 0,
                startDate: "",
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            },
            {
                id: "3",
                title: "tea",
                status: TaskStatuses.New,
                todoListId: "todolistId2",
                addedDate: "",
                deadline: "",
                description: "",
                order: 0,
                startDate: "",
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            }
        ]
    }
})

test("correct task should be deleted from correct array", () => {

    const action = removeTaskAC({taskId: "2", todolistId: "todolistId2"});

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        "todolistId1": [
            {
                id: "1",
                title: "CSS",
                status: TaskStatuses.New,
                todoListId: "todolistId1",
                addedDate: "",
                deadline: "",
                description: "",
                order: 0,
                startDate: "",
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            },
            {
                id: "2",
                title: "JS",
                status: TaskStatuses.Completed,
                todoListId: "todolistId1",
                addedDate: "",
                deadline: "",
                description: "",
                order: 0,
                startDate: "",
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            },
            {
                id: "3",
                title: "React",
                status: TaskStatuses.New,
                todoListId: "todolistId1",
                addedDate: "",
                deadline: "",
                description: "",
                order: 0,
                startDate: "",
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            }
        ],
        "todolistId2": [
            {
                id: "1",
                title: "bread",
                status: TaskStatuses.New,
                todoListId: "todolistId2",
                addedDate: "",
                deadline: "",
                description: "",
                order: 0,
                startDate: "",
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            },
            {
                id: "3",
                title: "tea",
                status: TaskStatuses.New,
                todoListId: "todolistId2",
                addedDate: "",
                deadline: "",
                description: "",
                order: 0,
                startDate: "",
                priority: TaskPriorities.Low,
                entityStatus: "idle"
            }
        ]
    });
});

test("correct task should be added to correct array", () => {

    const action = addTaskAC({task: {
        id: "4",
        title: "juce",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        addedDate: "",
        deadline: "",
        description: "",
        order: 0,
        startDate: "",
        priority: TaskPriorities.Low
    }});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("juce");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
})

test("status of specified task should be changed", () => {

    const action = updateTaskAC({taskId: "2", model: {status: TaskStatuses.New}, todolistId: "todolistId2"});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
    expect(endState["todolistId1"][1].status).toBe(TaskStatuses.Completed);
});

test("title of specified task should be changed", () => {

    const action = updateTaskAC({taskId: "2", model: {title: "cheese"}, todolistId: "todolistId2"});

    const endState = tasksReducer(startState, action)

    expect(endState["todolistId2"][1].title).toBe("cheese");
    expect(endState["todolistId1"][1].title).toBe("JS");
});

test("new array should be added when new todolist is added", () => {

    const action = addTodoListAC({
            todolist: {
                id: "bla",
                title: "What to learn",
                order: 0,
                addedDate: ""
            }
        }
    );
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }
    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test("ids should be equals", () => {
    const startTasksState: TaskDomainStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    const action = addTodoListAC({todolist: {
        id: "todolistId1",
        title: "What to learn",
        order: 0,
        addedDate: ""
    }});

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todoListsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});

test("property with todolistId should be deleted", () => {

    const action = removeTodoListAC({id: "todolistId2"});
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});

test("empty arrays should be added when we set todolists", () => {

    const action = setTodolistsAC({
        todolists: [
            {id: "1", title: "What to learn", order: 0, addedDate: ""},
            {id: "2", title: "What i know", order: 0, addedDate: ""}
        ]
    });
    const endState = tasksReducer({}, action)
    const keys = Object.keys(endState);

    expect(keys.length).toBe(2);
    expect(endState["1"]).toBeDefined();
    expect(endState["2"]).toBeDefined();
});

test("tasks should be added for todolist", () => {

    const action = setTasksAC({
        tasks: startState["todolistId1"], todolistId:"todolistId1"
    });
    const endState = tasksReducer({
        "todolistId2":[],
        "todolistId1":[],

    }, action)
    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'].length).toBe(0);
});










