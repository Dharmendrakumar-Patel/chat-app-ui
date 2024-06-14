'use client'
import { useState, useEffect } from "react"
import { gql } from "@apollo/client";
import createApolloClient from "../apollo-client";

type User = {
  _id?: String
  firstname?: String
  lastname?: String
  email?: String
  password?: String
}

export default function Home() {
  const client = createApolloClient();
  const [user, setUser] = useState<User[]>([])

  const getUsers = async () => {
    const { data } = await client.query({
      query: gql`
        query Users {
            users {
                email
                firstname
                lastname
            }
        }
      `,
    });
    console.log(data)
    return  setUser(data.users.slice(0, 4))
  }

  useEffect(() => {
    getUsers()
  }, [])

  const handleDelete = (data: User) => {
    console.log("deleted", data)
  }
  
  return (
    <main className="flex min-h-screen flex-col p-12">
      <h1 className="w-full text-2xl text-center font-semibold">User Data</h1>
      <div className="pt-4 overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>    
            {
              user.length > 0 && user.map((data: User, index: number) => {
                return (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{data?.firstname} {data?.lastname}</td>
                    <td>{data?.email}</td>
                    <td className="flex items-center justify-between">
                      <button className="btn btn-circle" onClick={()=> handleDelete(data)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </main>
  );
}
