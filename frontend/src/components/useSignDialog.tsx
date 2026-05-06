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
import { SigninForm } from "@/components/ui/signin-form"
import * as React from "react"

//object for sign in dialog props
type DialogSigninProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  // fires when registration succeeds but auto-login fails — parent should open the login dialog
  onRegisterSuccess?: () => void
  // fires when registration AND auto-login both succeed — parent should just close this dialog
  onAutoLoginSuccess?: () => void
}

export function DialogSignin({ open, onOpenChange, onRegisterSuccess, onAutoLoginSuccess }: DialogSigninProps) {
  return (
    //Dialog component are open
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger render={<Button variant="outline">Sign Up</Button>} />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create your LearningPath Account</DialogTitle>
            <DialogDescription>
                Enter your email, username, and password to create an account
            </DialogDescription>
          </DialogHeader>
            <SigninForm
              onRegisterSuccess={onRegisterSuccess}
              onAutoLoginSuccess={onAutoLoginSuccess} />
        </DialogContent>
    </Dialog>
  )
}
