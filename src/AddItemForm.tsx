import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import styles from "./Todolist.module.css";

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

export const AddItemForm = (props: AddItemFormPropsType) => {
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
            <input
                className={error ? styles.error : ''}
                value={title}
                onChange={onChangeHandler}
                onKeyPress={onKeyPressHandler}
            />
            <button onClick={addItem}>+</button>
            {error && <div className={styles.errorMessage}>Title is required</div>}
        </div>
    );
};
