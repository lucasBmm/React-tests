import { waitFor } from '@testing-library/react';
import { addUser, removeUser, userState } from "./user";
import userReducer from './user';

describe('User reducer tests', () => {
    const initialState: userState = {
        email: '',
        token: ''
    };

    it('Should handle initial state', () => {
        expect(userReducer(undefined, { type: 'unknown' })).toEqual({
            email: '',
            token: ''
        });
    });

    it('Should handle user adding', () => {
        const newUser: userState = {
            email: 'user@email.com',
            token: 'randomToken'
        };

        const actual = userReducer(initialState, addUser(newUser));

        jest.spyOn(Storage.prototype, 'setItem');

        expect(actual).toStrictEqual(newUser);

        waitFor(() => expect(localStorage.setItem).toHaveBeenCalled());
    });

    it('Should handle user remove', () => {
        const newUser: userState = {
            email: 'user@email.com',
            token: 'randomToken'
        };

        const actual = userReducer(newUser, removeUser());

        waitFor(() => expect(actual).toStrictEqual(initialState));
    });
})

export {}