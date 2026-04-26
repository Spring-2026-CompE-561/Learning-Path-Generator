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
import { SigninForm } from "@/components/ui/signin-form"

export function DialogSignin() {
  return (
    <Dialog>
      <form>
        <DialogTrigger render={<Button variant="outline">Sign in</Button>} />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Create your LearningPath Account</DialogTitle>
            <DialogDescription>
                Enter your email, username, and password to create an account
            </DialogDescription>
          </DialogHeader>
            <SigninForm />
        </DialogContent>
      </form>
    </Dialog>
  )
}
