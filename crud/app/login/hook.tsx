'use client'
import { useState } from 'react'
import { gql } from "@apollo/client";
import createApolloClient from "../../apollo-client";

export type User = {
    _id?: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
};

export type LoginUserInput = {
    _id?: string;
    firstname?: string;
    lastname?: string;
    email: string;
    password: string;
};

const LOGIN_USER = gql`
  mutation LoginUser($login: LoginUserInput!) {
    login (login: $login) {
        _id
        email
        firstname
        lastname
    }
  }
`;

export default function useGraphQLAuth() {
    const client = createApolloClient()

    const loginUser = async (loginData: LoginUserInput) => {
        try {
            const { data } = await client.mutate({
                mutation: LOGIN_USER,
                variables: { login: loginData }
            });

            return data.login
        } catch (error) {
            console.error('Error removing user:', error);
        }
    };

    return {
        loginUser
    };
}
