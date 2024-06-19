'use client'
import  { useEffect, useState } from 'react'
import useGraphQL, { User } from "./hook";
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import UserForm from './_components/form';
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast";
import { getCookie } from '../action';
import { useRouter } from 'next/navigation';

function Home() {
  const { toast } = useToast();
  const [isOpen, setOpen] = useState(false)
  const [isOpenAdd, setOpenAdd] = useState(false)
  const { users, userData, setUserData, removeUser, getUsers } = useGraphQL()
  const router = useRouter()

  const cookie = async () => {
    return await getCookie('chatApp');
  }

  useEffect(() => {
      cookie().then((res: any) => res !== undefined && router.push('/login'))
  }, [])

  useEffect(() => {
    getUsers()
  }, [])

  const handleDelete = (id: string | undefined) => {
    try {
      const message = removeUser(id)
      toast({ description: message })
    } catch (err) {
      toast({ description: JSON.stringify(err) })
    }
  }

  const handleCloseEdit = async () => {
    setUserData(null)
    setOpen(!isOpen)
    getUsers()
  }

  const handleEdit = (data: User) => {
    setOpen(!isOpen)
    setUserData(data)
  };

  const handleCloseCreate = () => {
    setOpenAdd(!isOpenAdd)
    getUsers()
  }

  const handleCreate = () => {
    setOpenAdd(!isOpenAdd)
  }

  return (
    <main className="flex min-h-screen w-screen flex-col p-12">
      <Toaster />
      <div className='flex items-center justify-between'>
        <h1 className="w-full text-2xl text-center font-semibold">User Data</h1>
        <Button onClick={() => handleCreate()}>
          Add User
        </Button>
      </div>

      <Dialog open={isOpenAdd} onOpenChange={setOpenAdd}>
        <UserForm 
          action='add' 
          data={{
            _id: '',
            firstname: '',
            lastname: '',
            email: '',
            password: '',
          }} 
          close={() => handleCloseCreate()} />
      </Dialog>

      {
        userData !== null && 
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <UserForm data={userData as User} close={() => handleCloseEdit()}/>
        </Dialog>
      }

      <div className="w-full pt-4 overflow-x-auto">
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
            {users.length > 0 &&
              users.map((data: User, index: number) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>
                    {data?.firstname} {data?.lastname}
                  </td>
                  <td>{data?.email}</td>
                  <td className="max-w-40 flex items-center justify-evenly">
                    <button className="btn btn-circle mr-3 sm:mr-0" onClick={() => handleDelete(data?._id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <button className="btn btn-circle" onClick={() => handleEdit(data)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.824 16.326A11.424 11.424 0 0 1 12 19.44v-3.548a3.548 3.548 0 0 1 .824-2.174l8-8a1.773 1.773 0 0 1 2.596 2.596l-8 8zM5 14v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Home