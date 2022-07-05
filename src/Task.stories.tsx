import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {Task} from "./Task";
import {ReduxStoreProviderDecorator} from "./stories/decorators/ReduxStoreProviderDecorator";
import {useSelector} from "react-redux";
import {AppRootStateType} from "./Store/store";
import {TaskType} from "./API/todolistAPI";

export default {
    title: 'Todolist/Task',
    component: Task,
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof Task>;

const TaskWithDispatch = () => {
    const task = useSelector<AppRootStateType, TaskType>(state => state.tasks['todolistId1'][0])
    return <Task
        task={task}
        todolistId={"todolistId1"}
    />
}

const Template: ComponentStory<typeof TaskWithDispatch> = () => <TaskWithDispatch />;

export const TaskExample = Template.bind({});
TaskExample.args = {
    // task: {id: '1', isDone: true, title: 'js'},
    // todolistId: 'todolistId1'
}
