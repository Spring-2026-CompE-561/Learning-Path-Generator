"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"

export function AccountForm() {

  return (
    <div className= "flex">
              <Card>
        <CardContent>
          <form id="login-form">
            <FieldGroup>
              {/*Email Field */}
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                       id="email"

                      placeholder="m@example.com"
                      autoComplete="off"
                    />
              {/*Password Field */} 
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input 
                         id="password"

                        type="password" 
                        placeholder="********"
                        autoComplete="off"
                    />
              <Field>
                  <Button type="submit">Login</Button>
              </Field>
  
            </FieldGroup>
          </form>
        </CardContent>
      </Card>


    </div>
 
  )
}