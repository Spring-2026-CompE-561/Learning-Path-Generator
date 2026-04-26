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
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context"



//form schema for validation using zod
const formSchema = z.object({
  email: z.string()
          .trim()
          .min(1, "Email is required")
          .email("Invalid email address"),
  username: z.string()
            .trim()
            .min(3, "Username must be at least 3 characters")
            .max(20, "Username must be at most 20 characters"),
  password: z.string()
            .trim()
            .min(8, "Password must be at least 8 characters")
            .max(10, "Password must be at most 10 characters"),
            confirmPassword: z.string()
    })
    /*Making sure password and confirm password match*/
    .refine((values) => values.password === values.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    })

export function SigninForm({className,...props
}: React.ComponentProps<"div">) {
  //function to handle form submission

  //hook to call
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    }
  })

  //FixMe: Need to call API to validate user credentials and handle login logic. For now, just showing a success toast on form submission.
  //FixMe: Need to change page to dashboard on successfull login
  function onSubmit(data: z.infer<typeof formSchema>){
    //FIXME: For testing using the uncomment code
    //The comment code is for successful login, for real implementation
    // toast.success("Login successful!",
    //   {position: "top-center"})
    //   form.reset()

    //code to display submited input as JSON in the toast
    toast("Here is your Account Information:", {      
      description: (
        <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 text-code-foreground">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    })
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
