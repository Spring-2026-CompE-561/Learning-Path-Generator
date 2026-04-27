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

export function DialogSignin() {
  //variable to monitor state of the dialog
  const [open, setOpen] = React.useState(false)
  return (
    //Dialog component are open
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger render={<Button variant="outline">Sign in</Button>} />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create your LearningPath Account</DialogTitle>
            <DialogDescription>
                Enter your email, username, and password to create an account
            </DialogDescription>
          </DialogHeader>
            <SigninForm
              onRegisterSuccess = {() => {setOpen(false)}} />
        </DialogContent>
      </form>
    </Dialog>
  )
}
