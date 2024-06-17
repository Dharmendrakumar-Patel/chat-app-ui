'use client'
import { useState } from 'react'
import { gql } from "@apollo/client";
import createApolloClient from "../apollo-client";

export type User = {
    _id?: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
};

type CreateUserInput = {
    _id?: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
};

type UpdateUserInput = {
    _id: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
};

const GET_USERS = gql`
    query GetUsers {
        users {
            _id
            firstname
            lastname
            email
        }
    }
`;

const REMOVE_USER = gql`
  mutation RemoveUser($_id: String!) {
    deleteUser(_id: $_id) {
      _id
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
        _id
        firstname
        lastname
        email
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($_id: String!, $updateUserInput: UpdateUserInput!) {
    updateUser(_id: $_id, updateUserInput: $updateUserInput) {
        _id
        firstname
        lastname
        email
    }
  }
`;

export default function useGraphQL() {
    const [users, setUsers] = useState<User[]>([]);
    const [userData, setUserData] = useState<User | null>(null);
    const client = createApolloClient();

    const getUsers = async () => {
        try {
            const { data } = await client.query({
                query: GET_USERS,
            });
            
            return setUsers(data.users.slice(0, 4));
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const removeUser = async (id: string | undefined) => {
        try {
            await client.mutate({
                mutation: REMOVE_USER,
                variables: { _id: id }
            });

            getUsers()

            return
        } catch (error) {
            console.error('Error removing user:', error);
        }
    };

    const createUser = async (data: CreateUserInput) => {
        try {
            await client.mutate({
                mutation: CREATE_USER,
                variables: { createUserInput: data }
            });

            return
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    const updateUser = async (id: string | undefined, data: Partial<User>) => {
        try {
            await client.mutate({
                mutation: UPDATE_USER,
                variables: { _id: id, updateUserInput: data }
            });

            return
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return {
        users,
        userData,
        setUserData,
        getUsers,
        createUser,
        updateUser,
        removeUser,
    };
}
