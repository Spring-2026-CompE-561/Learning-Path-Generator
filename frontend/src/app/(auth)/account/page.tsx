"use client";
import { AccountForm } from "@/components/useprofile"

export default function Account() {
  return (

    <div className="flex w-full flex-col items-center justify-center gap-8 py-20">
      

      <h2 className="text-2xl">Account Seetings</h2>
      <p>Manage your profile and preference</p>
      <AccountForm />
    </div>
    
  );
}
