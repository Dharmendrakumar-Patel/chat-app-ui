import { useState } from 'react';
import useGraphQL, { User } from '../hook';
import { DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type UserFormProps = {
    data?: User;
    action?: string;
    close: Function
};

export default function UserForm({ data, action = 'edit', close }: UserFormProps) {
    const { createUser, updateUser } = useGraphQL();
    const [loading, setLoading] = useState(false);

    const initialState: User = {
        _id: data?._id || '',
        firstname: data?.firstname || '',
        lastname: data?.lastname || '',
        email: data?.email || '',
        password: '',
    };

    const [formData, setFormData] = useState<User | null>(initialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevState: any) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            if (action !== 'edit') {
                await createUser(formData as User);
            } else {
                await updateUser(formData?._id as string, formData as User);
            }

            close()
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!loading && formData !== null && (
                <DialogContent className="sm:max-w-[800px] w-[80%] h-auto pb-0 overflow-y-scroll">
                    <DialogHeader>
                        <DialogClose className="hidden" id="closeDialog" />
                        <DialogTitle>{action !== 'edit' ? 'Add' : 'Edit'} User</DialogTitle>
                        <DialogDescription>
                            {action !== 'edit' ? 'Create' : 'Make changes to'} User profile here. Click save when you are done.
                        </DialogDescription>
                    </DialogHeader>
                    <form method="post" onSubmit={handleSubmit}>
                        <div className="grid lg:grid-cols-2 gap-4 py-4">
                            <div>
                                <Label htmlFor="firstname" className="text-right">
                                    First Name:
                                </Label>
                                <Input
                                    id="firstname"
                                    name="firstname"
                                    className="col-span-3 mt-2"
                                    placeholder="Enter First Name"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="lastname" className="text-right">
                                    Last Name:
                                </Label>
                                <Input
                                    id="lastname"
                                    name="lastname"
                                    className="col-span-3 mt-2"
                                    placeholder="Enter Last Name"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="email" className="text-right">
                                    Email:
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    className="col-span-3 mt-2"
                                    placeholder="Enter Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            {action !== 'edit' && (
                                <div>
                                    <Label htmlFor="password" className="text-right">
                                        Password:
                                    </Label>
                                    <Input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="col-span-3 mt-2"
                                        placeholder="Enter Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="w-full pt-2 pb-4 flex justify-end sticky bottom-0">
                            <DialogClose asChild>
                                <Button className="mr-2" type="button" variant="outline">
                                    Close
                                </Button>
                            </DialogClose>
                            <Button type="submit">{action !== 'edit' ? 'Submit' : 'Update'}</Button>
                        </div>
                    </form>
                </DialogContent>
            )}
        </>
    );
}
