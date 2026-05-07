"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { getToken, clearToken } from "@/lib/auth"
import UserProfile from "@/components/ui/profileIcon"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"



//form schema for validation using zod
const formSchema = z.object({
    email: z.string()
        .trim()
        .email("Invalid email address")
        .optional()
        .or(z.literal("")),
    username: z.string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters")
        .optional()
        .or(z.literal("")),
    password: z.string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .max(10, "Password must be at most 10 characters")
        .optional()
        .or(z.literal("")),
})
//function to be called on successful registration
type SigninFormProps = React.ComponentProps<"div"> & {
    onRegisterSuccess?: () => void
}

//function to delete account
//mirrors handleLogOut: backend call is best-effort, local cleanup is mandatory.
//if the token's already expired, the DELETE returns 401 — we still wipe
//credentials locally so the user isn't trapped with a dead session.
async function handleDeleteAccount() {
    const confirmed = window.confirm(
        "Are you sure you want to delete your account? this action cannot be undone"
    )
    if (!confirmed) return

    const token = getToken()
    let backendOk = false

    try {
        const res = await fetch("http://127.0.0.1:8000/users/me", {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
        backendOk = res.ok
    } catch {
        // network blip — fall through to local cleanup
    }

    if (backendOk) {
        toast.success("Account deleted successfully", { position: "top-center" })
    } else {
        // server-side delete didn't go through. flag it so the user knows the
        // record may still exist, but we've at least logged them out locally.
        toast.error(
            "Could not delete account on the server, but you've been logged out. Please contact support if the account still exists.",
            { position: "top-center" }
        )
    }

    clearToken()
    window.location.href = "/"
}

//function to log out account
//backend revocation is best-effort; we always clear the local token and
//redirect, otherwise an expired/invalid token leaves the user stuck (the
//server keeps returning 401, the function would bail before clearing).
export async function handleLogOut() {
    const token = getToken()

    try {
        const res = await fetch("http://127.0.0.1:8000/users/logout", {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
        if (res.ok) {
            toast.success("Log Out successfully", { position: "top-center" })
        } else {
            // token was probably already expired — that's fine, log out locally anyway
            toast.message("Logged out", { position: "top-center" })
        }
    } catch {
        // network blip / backend down — still wipe local credentials
        toast.message("Logged out", { position: "top-center" })
    }

    clearToken()
    window.location.href = "/"
}


export function AccountForm({ className, onRegisterSuccess, ...props
}: SigninFormProps) {
    //function to handle form submission

    //hook to call
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
        }
    })

    //function to collect user information
    React.useEffect(() => {
        async function getCurrentUser() {
            const token = getToken()
            if (!token) {
                toast.error("no login token found")
                return
            }
            const res = await fetch("http://127.0.0.1:8000/users/me", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!res.ok) {
                toast.error("Failed to load account info")
                return
            }
            const user = await res.json()
            
            //continously showing user username and email
            form.reset({
                email: user.email,
                username: user.username,
                password:"********"
            })
        }
        getCurrentUser()
    }, [form])


    //submitting update user information
    async function onSubmit(data: z.infer<typeof formSchema>) {
        const token = getToken()
        
        //filtering input data only sending chaning field
        //checking if the field being modify or not
        //depend on that sending input or not
        const dirtyFields = form.formState.dirtyFields
        const filteredData = Object.fromEntries(
            Object.entries(data).filter(([key, value]) => {
                const fieldState = form.getFieldState(key as keyof z.infer<typeof formSchema>)
                return fieldState.isDirty && value !==""
            })
        )

        //if no key being modify then return error
        if(Object.keys(filteredData).length === 0){
            toast.error("no changes to save")
            return
        }

        //sending http request
        const res = await fetch("http://127.0.0.1:8000/users/update", {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(filteredData),
        })

        //handling error response
        if (!res.ok) {
            const errorData = await res.json()
            toast.error(`Updationg failed: ${errorData?.message || "Unknown error"}`, {
                position: "top-center",
            })
            return
        }

        //waiting backend reponse
        const returnedData = await res.json();

        //FIXME: For testing using the uncomment code
        //The comment code is for successful login, for real implementation
        // toast.success("Login successful!",
        //   {position: "top-center"})
        //   form.reset()

        //code to display submited input as JSON in the toast
        toast("Here is your Account Information:", {
            description: (
                <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
                    <code>
                        {res.status === 200 ?
                            "Account Updated Successfully!" :
                            "Unexpected response from server. Please try again later."
                        }
                    </code>
                </pre>
            ),
            position: "bottom-right",
            classNames: {
                content: "flex flex-col gap-2",
            },
            style: {
                "--border-radius": "calc(var(--radius)  + 4px)",
            } as React.CSSProperties,
        });
        return returnedData;
    }
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="border border-background">
                <div className="flex flex-col justify-start">
                    <CardHeader>
                        <div>
                            <h2 className="text-5xl">Account Settings</h2>
                        </div>
                        <CardDescription>
                            <p>Manage your profile and preferences</p>
                        </CardDescription>
                    </CardHeader>
                </div>
                <CardContent className="flex flex-col gap-5">
                    <div className="flex flex-row w-full gap-8 justify-start items-center">
                        <UserProfile className="w-[10%] h-[10%]" />
                        <div>
                            <Button className="text-lg text-white hover:bg-background hover:text-foreground">Change Avatar</Button>
                            <p>JPG, GIF, or PNG</p>
                        </div>
                    </div>
                    <form id="signin-form" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="gap-5 flex flex-col">
                            <FieldGroup className="flex-row">
                                {/*Email Field */}
                                <Controller
                                    name="email"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="email">Email</FieldLabel>
                                            <Input
                                                {...field}
                                                id="email"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="m@example.com"
                                                autoComplete="off"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                {/*User-Name Field */}
                                <Controller
                                    name="username"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="username">Username</FieldLabel>
                                            <Input
                                                {...field}
                                                id="username"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="john_doe"
                                                autoComplete="off"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                {/*Password Field */}
                                <Controller
                                    name="password"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <div className="flex items-center">
                                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                            </div>
                                            <Input
                                                {...field}
                                                id="password"
                                                aria-invalid={fieldState.invalid}
                                                type="password"
                                                placeholder="********"
                                                autoComplete="off"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}

                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                            <FieldGroup className="flex-row">
                                <Field>
                                    <Button type="submit" className="text-white hover:bg-background hover:text-foreground">Save</Button>
                                </Field>

                                <Field>
                                    <Button type="button" className="text-white hover:bg-background hover:text-foreground" onClick={handleLogOut}>Log Out</Button>
                                </Field>

                                <Field>
                                    <Button type="button" className="text-white hover:bg-background hover:text-foreground" onClick={handleDeleteAccount}>Delete Account</Button>
                                </Field>
                            </FieldGroup>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
