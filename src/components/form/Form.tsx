import axios, { AxiosResponse } from 'axios';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { addUser, selectUser, userState } from '../../features/user';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { apiError } from '../../interfaces/api';

export const loginUser = (form: {email: string, password: string}) => {
    return axios.post(process.env.REACT_APP_API_URL!, { form });
}

export function Form(): JSX.Element {
    const [ formValues, setFormValues ] = useState({ email: '', password: '' });
    const [ formError, setFormError   ] = useState({ email: '', password: '', credentials: '' });
    const dispatch = useAppDispatch();

    const onFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setFormValues({...formValues, [e.target.name]: e.target.value });
    }

    const checkEmail = (): void => {
        if (formValues.email.length < 5) {
            setFormError({...formError, email: 'User email must be at least 5 caracters long'});
        } else {
            setFormError({...formError, email: ''})
        }
    }

    const checkPassword = (): void => {
        if (formValues.password.length < 3) {
            setFormError({...formError, password: 'User password must be at least 3 caracters long'});
        } else {
            setFormError({...formError, password: ''})
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setFormError({...formError, credentials: ''});
        loginUser(formValues)
        .then((response: AxiosResponse<{ token: string }>) => {
            dispatch(
                addUser({ 
                    email: formValues.email, 
                    token: response.data.token 
                }
            ));
        })
        .catch((error: AxiosResponse<apiError>) => {
            setFormError({...formError, credentials: error.data.message});
        });
    }

    return ( 
        <div className="container-fluid col-md align-middle" style={{ height: '100%' }}>
            <div className="row justify-content-md-center">
                <form className='col-lg-6' onSubmit={e => handleSubmit(e)}>
                    <div className="form-group">
                        <label htmlFor="emailInput">Email address</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            id="emailInput" 
                            aria-describedby="emailHelp" 
                            placeholder="Enter email" 
                            value={formValues.email}
                            onChange={e => onFormChange(e)}
                            name='email'
                            onBlur={checkEmail}    
                        />
                        {formError.email && <small role='alert' className="form-text text-danger"> {formError.email} </small>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="passwordInput">Password</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="passwordInput" 
                            placeholder="Enter password" 
                            value={formValues.password}
                            onChange={e => onFormChange(e)}
                            name='password'
                            onBlur={checkPassword} 
                        />
                        {formError.password && <small role='alert' className="form-text text-danger"> {formError.password} </small>}
                    </div>
                    {formError.credentials && <small role='alert' className="form-text text-danger"> {formError.credentials} </small>}
                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        role='button' disabled={formError.email || formError.password ? true : false}
                    >
                        Submit
                    </button>
            </form>
            </div> 
        </div>
    );
}