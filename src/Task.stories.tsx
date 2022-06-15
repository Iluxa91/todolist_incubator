import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';

import {action} from "@storybook/addon-actions";
import {Task} from "./Task";
import {ReduxStoreProviderDecorator} from "./ReduxStoreProviderDecorator";
import {useSelector} from "react-redux";
import {AppRootStateType} from "./reducers/store";
import {TaskType} from "./TodolistWithTasks";


// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todolist/Task',
    component: Task,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
    argTypes: {},
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof Task>;

const TaskWithDispatch = () => {
    const task = useSelector<AppRootStateType, TaskType>(state => state.tasks['todolistId2'][0])
    return <Task

        task={task}
        todolistId={"todolistId1"}
    />
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TaskWithDispatch> = (args) => <TaskWithDispatch />;

export const TaskWithDispatchStories = Template.bind({});
TaskWithDispatchStories.args = {}
// More on args: https://storybook.js.org/docs/react/writing-stories/args
// TaskIsDoneStories.args = {
//     onClickHandler: action('removeTask'),
//     todolistId: 'string',
//     task: {id: 'sdf', isDone: true, title: 'js'}
// }
