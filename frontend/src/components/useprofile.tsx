"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { cn } from "@/lib/utils"
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
async function handleDeleteAccount() {
    const confirmed = window.confirm(
        "Are you sure you want to delete your account? this action cannot be undone"
    )
    if (!confirmed) return

    const token = localStorage.getItem("access_token")

    const res = await fetch("http://127.0.0.1:8000/users/me", {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        }
    })

    if (!res.ok) {
        toast.error("Failed to delete Account", {
            position: "top-center"
        })
        return
    }
    toast.success("Account deleted successfully", {
        position: "top-center",
    })


    localStorage.removeItem("token")
    window.location.href = "/"
}

//function to log out account
async function handleLogOut() {

    const token = localStorage.getItem("access_token")

    const res = await fetch("http://127.0.0.1:8000/users/logout", {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        }
    })

    if (!res.ok) {
        toast.error("Failed to Log Out", {
            position: "top-center"
        })
        return
    }
    toast.success("Log Out successfully", {
        position: "top-center",
    })


    localStorage.removeItem("token")
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
            const token = localStorage.getItem("access_token")
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
            form.setValue("email", user.email)
            form.setValue("username", user.username)
        }
        getCurrentUser()
    }), [form]

    async function onSubmit(data: z.infer<typeof formSchema>) {
        //sending http request
        const res = await fetch("http://127.0.0.1:8000/users/register", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        //handling error response
        if (!res.ok) {
            const errorData = await res.json()
            toast.error(`Registration failed: ${errorData?.message || "Unknown error"}`, {
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
                        {res.status === 201 ?
                            "Account created Successfully ! \n You can now log in with your credentials." :
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

        //reset form after successful submission
        //and confirm the resiter is successfull
        if (res.status === 201) {
            form.reset()
            onRegisterSuccess?.()
        }

        return returnedData;

    }
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
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
                            <Button className="text-lg">Change Avatar</Button>
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
                                    <Button type="submit">Save</Button>
                                </Field>

                                <Field>
                                    <Button type="button" onClick={handleLogOut}>Log Out</Button>
                                </Field>

                                <Field>
                                    <Button type="button" onClick={handleDeleteAccount}>Delete Account</Button>
                                </Field>
                            </FieldGroup>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
