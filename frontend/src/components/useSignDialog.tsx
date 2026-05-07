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
        <DialogTrigger
          render={
            <Button
              variant="outline"
              // light: filled blue + white text (matches Login)
              // dark: revert to the default outline variant
              className="border-2 border-blue-700 bg-blue-700 text-white hover:border-blue-800 hover:bg-blue-800 hover:text-white dark:border dark:border-input dark:bg-input/30 dark:text-foreground dark:hover:bg-input/50 dark:hover:text-foreground"
            >
              Sign Up
            </Button>
          }
        />
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
