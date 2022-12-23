import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Form } from "./Form";
import axiosMock from "axios";
import { Provider } from 'react-redux';
import store from '../../app/store';
import '@testing-library/jest-dom';
import { apiError } from "../../interfaces/api";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

jest.mock("axios");

describe('Form component tests', () => {
    let emailInput: HTMLInputElement;
    let passwordInput: HTMLInputElement;

    beforeEach(async () => {
        await act(async () => render(<Provider store={store}><Form /></Provider>));

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

        userEvent.type(emailInput, randomEmail);
        userEvent.type(passwordInput,randomPassword);

        expect(emailInput).toHaveValue(randomEmail);
        expect(passwordInput).toHaveValue(randomPassword);
    });

    it('Should warn user when none or invalid e-mail or password is provided', () => {
        userEvent.type(emailInput, 'foo');
        userEvent.type(passwordInput, 'bar');

        waitFor(() => expect(screen.queryAllByRole('alert')).toHaveLength(2));
    });

    it('Should disable submit button when have form errors', () => {
        userEvent.type(emailInput, 'foo');
        userEvent.type(passwordInput, 'bar');

        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('Should successfully login when correct user credentials are given', async () => {
        userEvent.type(emailInput, 'user@email.com');
        userEvent.type(passwordInput, 'password');

        const data = { token: 'abcde' };

        (axiosMock.post as jest.Mock).mockResolvedValueOnce({data});
        const setItem = jest.spyOn(Storage.prototype, 'setItem')

        const button = screen.getByRole('button');

        fireEvent.click(button);

        expect(axiosMock.post).toBeCalledTimes(1);
        waitFor(() => expect(setItem).toHaveBeenCalled());
    });

    it('Should display error message when user credentials are incorrect', async () => {
        fireEvent.change(emailInput, { target: { value: 'user@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });

        const response: { data: apiError} = { data: { message: 'The user has not been found' } };

        (axiosMock.post as jest.Mock).mockResolvedValueOnce(response);

        const button = screen.getByRole('button');

        await act( async () => {
            fireEvent.click(button);
        });

        waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(response.data.message));
    });
});

export {}