//for authentication protected pages

"use client";

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation";

export default function AuthLayout({ children }: { children: React.ReactNode }) {

    //State to check authentication status
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    //router for redirection
    const router = useRouter();

    //check authentication immediately when component mounts
    //if failed, redirect to landing page
    useEffect(() => {
        async function checkAuth(){
            const token = localStorage.getItem("access_token");
            
            if(!token){
                router.replace("/")
                return;
            }

            try {
                const res = await fetch("http://127.0.0.1:8000/users/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json"
                    },
                });

                if(!res.ok){
                    localStorage.removeItem("access_toekn");
                    router.replace("/");
                    return;
                }

                setIsAuthenticated(true);
            } catch (error){
                localStorage.removeItem("access_token");
                router.replace("/");
            } finally {
                setLoading(false);
            }

        }
        
        checkAuth();
        setLoading(false);
    }, [router]); 
    
    //Consider removing this in real implementation
    if(loading) {
        return <div>Checking authentication...</div>;
    }

    if(!isAuthenticated){
        return null;
    }

    return <>{children}</>
}
