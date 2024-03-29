import React, {ChangeEvent, KeyboardEvent, useState} from 'react';

type EditableSpanPropsType = {
    title: string
    setNewTitle: (newTitle: string) => void
    disabled?: boolean
}

export const EditableSpan = React.memo((props: EditableSpanPropsType) => {
    const [editMode, setEditMode] = useState(false)
    const onEditMode = () => setEditMode(true)
    const offEditMode = () => {
        setEditMode(false)
        props.setNewTitle(title)
    }
    let [title, setTitle] = useState(props.title)
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)
    const onKeyPressOffEditMode = (e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && offEditMode()

    return (
        editMode ?
            <input autoFocus
                   onBlur={offEditMode}
                   value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressOffEditMode}
                   disabled={props.disabled}
            />
            : <span onDoubleClick={onEditMode}>{props.title}</span>
    );
});