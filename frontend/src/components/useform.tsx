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
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context"


//form schema for validation using zod
const formSchema = z.object({
  email: z.string()
          .trim()
          .min(1, "Email is required")
          .email("Invalid email address"),
  password: z.string()
            .trim()
            .min(8, "Password must be at least 8 characters")
            .max(32, "Password must be at most 32 characters"),
})

export function LoginForm({className,...props
}: React.ComponentProps<"div">) {
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
  function onSubmit(data: z.infer<typeof formSchema>){
    toast.success("Login successful!",
      {position: "top-center"})
      form.reset()
      
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
                    {fieldState.error && (
                      <FieldDescription className="text-destructive">
                        {fieldState.error.message}
                      </FieldDescription>
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
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input 
                        {...field}
                        id="password" 
                        type="password" 
                        required />
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
