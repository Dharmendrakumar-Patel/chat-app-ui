"use client"
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from '@/lib/store/hook';
import { authUser, selectUser } from "@/lib/store/features/user/userSlice";
import useGraphQLAuth from "./hook"; // Adjust the import as per your hook implementation
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
    const { toast } = useToast();
    const { loginUser } = useGraphQLAuth();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser)
    const router = useRouter()

    const [userId, setuserId] = useState<string>("")
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: '' });

    useEffect(() => {
        dispatch(authUser(userId));
        router.push('/user')
    }, [userId, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userData = await loginUser(formData);
            if (!userData) {
                toast({
                    description: "Invalid Email Or Password",
                });
            } else {
                setuserId(userData._id)
                router.push("/user")
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                description: "An error occurred while logging in.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-screen h-screen flex flex-col justify-center items-center">
            <Toaster />
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Welcome To Login Page</CardTitle>
                </CardHeader>
                <CardContent>
                    {!loading && (
                        <form onSubmit={handleSubmit} className="max-w-80">
                            <div className="grid gap-4 py-4">
                                <div>
                                    <Label htmlFor="email" className="text-right">
                                        Email:
                                    </Label>
                                    <Input
                                        required
                                        id="email"
                                        name="email"
                                        className="col-span-3 mt-2"
                                        placeholder="Enter Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="password" className="text-right">
                                        Password:
                                    </Label>
                                    <Input
                                        required
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="col-span-3 mt-2"
                                        placeholder="Enter Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="w-full pt-2 pb-4 sticky bottom-0">
                                <Button type="submit" className="w-full">Login</Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>          
        </main>
    );
}
