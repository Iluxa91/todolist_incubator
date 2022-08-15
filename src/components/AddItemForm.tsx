import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton, TextField} from "@material-ui/core";
import {AddCircleOutline} from "@material-ui/icons";

type AddItemFormPropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = React.memo((props: AddItemFormPropsType) => {
    const [error, setError] = useState(false)
    let [title, setTitle] = useState("")
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setError(false)
        setTitle(e.currentTarget.value)
    }
    const addItem = () => {
        if (title.trim() !== '') {
            props.addItem(title.trim());
            setTitle("");
        } else {
            setError(true)
        }
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13) {
            addItem();
        }
    }
    return (
        <div>
            <TextField
            size={'small'}
            variant={"outlined"}
            value={title}
            onChange={onChangeHandler}
            onKeyPress={onKeyPressHandler}
            label={'title'}
            error={!!error}
            helperText={error&&"Title is required"}
            />
            <IconButton onClick={addItem} disabled={props.disabled}>
                <AddCircleOutline/>
            </IconButton>
        </div>
    );
})
