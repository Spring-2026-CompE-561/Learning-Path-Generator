import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoginForm } from "@/components/ui/login-form"
import * as React from "react"

//props to open login dialog after successful registration
type DialogLoginProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  //optinal to either open dialog by button or by register success
  showTrigger?: boolean
}


export function DialogLogin({ open, onOpenChange, showTrigger }: DialogLoginProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        {showTrigger && (
          <DialogTrigger render={<Button variant="outline">Log in</Button>} />
        )}
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Login to your account</DialogTitle>
            <DialogDescription>
                Enter your email below to login to your account
            </DialogDescription>
          </DialogHeader>
            <LoginForm />
        </DialogContent>
    </Dialog>
  )
}
