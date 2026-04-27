"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { cn } from "@/lib/utils"
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

//
import { useRouter } from "next/navigation"



//form schema for validation using zod
const formSchema = z.object({
  email: z.string()
          .trim()
          .min(1, "Email is required")
          .email("Invalid email address"),
  password: z.string()
            .trim()
            .min(8, "Password must be at least 8 characters")
            .max(10, "Password must be at most 10 characters"),
})

// used to tell the dialog to close after login
type LoginFormProps = React.ComponentProps<"div"> & {
  onLoginSuccess?: () => void
}

export function LoginForm({className, onLoginSuccess, ...props
}: LoginFormProps) {

  // used to redirect to dashboard after logging in 
  const router = useRouter()


  //function to handle form submission

  //hook to call
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  //FixMe: Need to call API to validate user credentials and handle login logic. For now, just showing a success toast on form submission.
  //FixMe: Need to change page to dashboard on successfull login

  // sends login req to backend and handles response
  async function onSubmit(data: z.infer<typeof formSchema>){
    //FIXME: For testing using the uncomment code
    //The comment code is for successful login, for real implementation
    // toast.success("Login successful!",
    //   {position: "top-center"})
    //   form.reset()

    // sends email and pass to backend login endpoint
    const res = await fetch("http://127.0.0.1:8000/users/login", {
      method: "POST",
      headers: {
        // send back json
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },

      // converts data into string
      body: new URLSearchParams({
        username: data.email,
        password: data.password,
      }).toString(),
    })
    
    // wrong password or username not found = error
    // true for success status codes but false for error status codes (duh)
    if(!res.ok) {

      // read error details
      const errorData = await res.json()

      // tell user what went wrong
      toast.error("Login failed: " + (errorData?.detail || "Unknown error"))
      return
    }

    // JWt token so other pages dont have to recheck and they knwo your logged in 
    const returnedData = await res.json()

    // saves token so other pages can check for it later when doing things
    localStorage.setItem("access_token", returnedData.access_token)

    // login works, notification for it
    toast.success("Login successful!", {
      position: "top-center",
    })

    // clear fields close the dialog then go to dashboard
    form.reset()
    onLoginSuccess?.()
    router.push("/dashboard")
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardContent>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/*Email Field */}
              <Controller
                name="email"
                control={form.control}
                render={({field, fieldState}) => (
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
              {/*Password Field */} 
              <Controller 
                name="password"
                control={form.control}
                render={({field, fieldState}) => (
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
              <Field>
                  <Button type="submit">Login</Button>
                  <FieldDescription className="text-center">
                    Don&apos;t have an account? <a href="#">Sign up</a>
                  </FieldDescription>
              </Field>
  
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
