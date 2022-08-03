import {ResponseType} from "../API/todolistAPI";
import {ErrorUtilsDispatchType, setAppErrorAC, setAppStatusAC} from "../store/app-reducer";
import {Dispatch} from "redux";

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch<ErrorUtilsDispatchType>) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: "Some error occurred"}))
    }
    dispatch(setAppStatusAC({status: "failed"}))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch<ErrorUtilsDispatchType>) => {
    dispatch(setAppErrorAC( {error: error.message ? error.message : "Some error occured"}))
    dispatch(setAppStatusAC({status: "failed"}))
}

