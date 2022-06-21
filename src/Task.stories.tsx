import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {Task} from "./Task";
import {ReduxStoreProviderDecorator} from "./stories/decorators/ReduxStoreProviderDecorator";

export default {
    title: 'Todolist/Task',
    component: Task,
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof Task>;

// const TaskWithDispatch = () => {
//     const task = useSelector<AppRootStateType, TaskType>(state => state.tasks['todolistId1'][0])
//     return <Task
//         task={task}
//         todolistId={"todolistId1"}
//     />
// }

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskIsDoneExample = Template.bind({});
TaskIsDoneExample.args = {
    task: {id: '1', isDone: true, title: 'js'},
    todolistId: 'todolistId1'
}
export const TaskIsNotDoneExample = Template.bind({});
TaskIsNotDoneExample.args = {
    task: {id: '1', isDone: false, title: 'js'},
    todolistId: 'todolistId1'
}

// export const TaskIsDoneStories = Template.bind({});
// TaskIsDoneStories.args = {
//     // CheckBoxHandler: action('task status is changed'),
//     todolistId: 'todolistId1',
//     task: {id: '1', isDone: true, title: 'js'}
// }
//
// export const TaskIsNotDoneStories = Template.bind({});
// TaskIsNotDoneStories.args = {
//     // CheckBoxHandler: action('task status is changed'),
//     todolistId: 'todolistId1',
//     task: {id: '2', isDone: false, title: 'js'}
// }
