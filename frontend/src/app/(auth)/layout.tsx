//for authentication protected pages

"use client";

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {

    //State to check authentication status
    const [checkingAuth, setCheckingAuth] = useState(true);
    //router for redirection
    const router = useRouter();

    //check authentication immediately when component mounts
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if(!token){
            router.push("/")
            return;
        }
        setCheckingAuth(false);
    }, [router]); 
    
    //Consider removing this in real implementation
    if(checkingAuth) {
        return <div>Checking authentication...</div>;
    }

    return <>{children}</>
}
