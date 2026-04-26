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

export function DialogLogin() {
  return (
    <Dialog>
      <form>
        <DialogTrigger render={<Button variant="outline">Log in</Button>} />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Login to your account</DialogTitle>
            <DialogDescription>
                Enter your email below to login to your account
            </DialogDescription>
          </DialogHeader>
            <LoginForm />
        </DialogContent>
      </form>
    </Dialog>
  )
}
