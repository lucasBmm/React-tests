import { fireEvent, getByRole, render, screen, waitFor } from "@testing-library/react";
import { Form } from "./Form";
import axiosMock from "axios";
import { Provider } from 'react-redux';
import store from '../../app/store';
import '@testing-library/jest-dom';
import * as Redux from "react-redux";

jest.mock("axios");
jest.mock("react-redux", () => ({
    ...jest.requireActual("react-redux"),
    useSelector: jest.fn(),
}));

describe('Form component tests', () => {
    let emailInput: HTMLInputElement;
    let passwordInput: HTMLInputElement;

    beforeEach(() => {
        render(<Provider store={store}><Form /></Provider>);

        emailInput    = screen.getByPlaceholderText<HTMLInputElement>('Enter email');
        passwordInput = screen.getByPlaceholderText<HTMLInputElement>('Enter password');
    });

    it('Should render email and password form', () => {
        expect(emailInput).toBeTruthy();
        expect(passwordInput).toBeTruthy();
    });

    it('Should change email and password input values when user type', () => {
        const randomEmail = 'login@email.com';
        const randomPassword = 'somePassword';

        fireEvent.change(emailInput, { target: { value: randomEmail } });
        fireEvent.change(passwordInput, { target: { value: randomPassword } });

        expect(emailInput).toHaveValue(randomEmail);
        expect(passwordInput).toHaveValue(randomPassword);
    });

    it('Should warn user when none or invalid e-mail or password is provided', () => {
        fireEvent.change(emailInput, { target: { value: '' } });
        fireEvent.change(passwordInput, { target: { value: '' } });

        fireEvent.focusOut(emailInput);
        fireEvent.focusOut(passwordInput);

        let mensagemErro = screen.queryAllByRole('alert');

        expect(mensagemErro).toHaveLength(2);
    });

    it('Should disable submit button when have form errors', () => {
        fireEvent.change(emailInput, { target: { value: '' } });
        fireEvent.change(passwordInput, { target: { value: '' } });

        fireEvent.focusOut(emailInput);
        fireEvent.focusOut(passwordInput);

        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('Should successfully login when correct user credentials are given and set token on local storage', async () => {
        fireEvent.change(emailInput, { target: { value: 'user@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });

        const data = { token: 'abcde' };

        (axiosMock.post as jest.Mock).mockResolvedValueOnce({data});

        const button = screen.getByRole('button');

        fireEvent.click(button);

        expect(axiosMock.post).toBeCalledTimes(1);

        // Redux mock
        (Redux.useSelector as jest.Mock).mockImplementation((callback) => {
            return callback({ email: 'user@email.com', token: data.token });
        });

        waitFor(() => expect(JSON.parse(localStorage.getItem('user')!)).toBe({ email: 'user@email.com', token: data.token })) ;
    });
});

export {}