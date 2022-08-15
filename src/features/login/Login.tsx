import React from "react"
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {FormikHelpers, useFormik} from "formik";
import {loginTC} from "../../store/authReducer";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {Navigate} from "react-router-dom";

export const Login = () => {
    const dispatch = useAppDispatch()
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

    type FormikErrorType = {
        email?: string
        password?: string
        rememberMe?: boolean
    }
    type FormValuesType = {
        email: string
        password: string
        rememberMe: boolean
    }
    const formik = useFormik({
            initialValues: {
                email: "",
                password: "",
                rememberMe: false
            },
            validate: (values) => {
                const errors: FormikErrorType = {}
                if (!values.email) {
                    errors.email = "Required"
                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                    errors.email = "Invalid email address"
                }
                if (!values.password) {
                    errors.password = "Required"
                } else if (values.password.length < 3) {
                    errors.password = "Invalid password input more than 2 symbols"
                }
                return errors
            },
            onSubmit: async (values: FormValuesType, formikHelpers: FormikHelpers<FormValuesType>) => {
                const action = await dispatch(loginTC(values))
                if (loginTC.rejected.match(action)) {

                    if (action.payload?.fieldsErrors?.length) {
                        const error = (action.payload?.fieldsErrors[0])
                        formikHelpers.setFieldError(error.field, error.error)
                    }
                }
            }
        },
    )

    if (isLoggedIn) {
        return <Navigate to={"/"}/>
    }
    return <Grid container justifyContent={"center"}>
        <Grid item justifyContent={"center"}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={"https://social-network.samuraijs.com/"}
                               target={"_blank"} rel="noreferrer"> here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            label="Email"
                            helperText={formik.touched.email && formik.errors.email &&
                                <div style={{color: "red"}}>{formik.errors.email}</div>}
                            margin="normal"
                            {...formik.getFieldProps("email")}
                        />
                        <TextField type="password"
                                   helperText={formik.touched.password && formik.errors.password &&
                                       <div
                                           style={{color: "red"}}>{formik.errors.password}</div>}
                                   label="Password"
                                   margin="normal"
                                   {...formik.getFieldProps("password")}
                        />
                        <FormControlLabel label={"Remember me"} control={<Checkbox
                            checked={formik.values.rememberMe}
                            {...formik.getFieldProps("rememberMe")}
                        />}/>
                        <Button type={"submit"} variant={"contained"} color={"primary"}>
                            Login
                        </Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}