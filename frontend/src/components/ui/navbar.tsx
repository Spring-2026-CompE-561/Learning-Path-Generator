"use client";

import { usePathname } from 'next/navigation';
import Link from "next/link";
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {Button, buttonVariants } from "@/components/ui/button";
import { NavigationMenuList } from '@base-ui/react';
import { cn } from '@/lib/utils';


//creating the list of the navbar items
const NavItems = [
    { label: "Dashboard", link: "/dashboard" },
    { label: "Schedule", link: "/schedule" },
    { label: "Account", link: "/account" },
];

export function Navbar() {
    return(
        <>
            <DesktopNavbar />
            <MobileNavbar/>
        </>
        
    )
}

function DesktopNavbar() {
    return (
        <div className="hidden border-separate border-b bg-background md:block">
            <nav className="w-full h-fit flex items-center justify-between p-5 bg-black-100">
                {/* loop through the nav items and create a new navbar item for each link */}
                {NavItems.map((item) => (
                    <NavbarItem 
                        key={item.label} 
                        link={item.link} 
                        label={item.label} 
                />
                ))}
            </nav>
        </div>

    );
}

function MobileNavbar() {
  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="w-full h-fit flex items-center justify-between p-5 bg-black-100">
        <Sheet>
          {/* Important: Ensure {...props} is applied to the Button */}
          <SheetTrigger
            render={(props) => (
              <Button {...props} variant="ghost" className="p-0">
                <Menu className="w-6 h-6" />
              </Button>
            )}
          />
          {/* Add a side so the component knows where to slide in from */}
          <SheetContent side="left" className="w-[300px]">
            <div className="flex flex-col gap-4 pt-10">
              {NavItems.map((item) => (
                <NavbarItem 
                  key={item.label} 
                  link={item.link} 
                  label={item.label} 
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}


//connecting the nav items to the navbar
interface navItemsProps {
    label: string;
    link: string;
    clickCallBack?: () => void;
}

//function to create individual navbar items for each page accordingly
//change css base on current path of the user, to show where they are
function NavbarItem({ link, label, clickCallBack }: Readonly<navItemsProps>) {
    //get current user path
    const pathname = usePathname();
    //confirm if the current path is the same as the link of the navbar item, if so, add animation to it
    const isActive = pathname === link;
    return (
        <div className="relative flex items-center">
            <Link
                href={link}
                className={cn(
                    buttonVariants({variant: "ghost" }),
                        "w-full justify-start text-xl text-muted-foreground hover:text-yellow-500",
                    isActive && "text-yellow-500",
                )}
                onClick={() => {
                    if (clickCallBack) clickCallBack();
                }}
            >
                {label}
            </Link>
            {isActive && (
                <div className="absolute -bottom-1 left-0 w-full h-1 bg-yellow-500 rounded" />
            )}
        </div>
    );
}