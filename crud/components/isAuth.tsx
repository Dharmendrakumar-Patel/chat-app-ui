"use client";

import { redirect } from "next/navigation";
import { useAppSelector } from "@/lib/store/hook";
import { selectUser } from "@/lib/store/features/user/userSlice";

export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const user = useAppSelector(selectUser)

    if(user == null || user == undefined) {
      redirect('/')
    }
    
    return <Component {...props} />;
  };
}