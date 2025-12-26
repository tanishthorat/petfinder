"use client";

import React from "react";
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";
import { Heart, LogOut, User as UserIcon, Plus, PawPrint, List } from "lucide-react";
import { useUser } from "@/lib/supabase/auth-context";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { toast } from "sonner";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, isLoading } = useUser();
  const router = useRouter();

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Find a Pet", href: "/swipe" },
    { name: "Matches", href: "/matches" },
    { name: "My Pets", href: "/my-pets" },
    { name: "Map", href: "/map" },
    { name: "Community", href: "/community" },
  ];

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  };

  return (
    <NextUINavbar 
      onMenuOpenChange={setIsMenuOpen} 
      maxWidth="xl" 
      className="bg-white shadow-md border-b border-gray-200 fixed top-0 z-50"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="font-bold text-inherit flex items-center gap-2">
            <Heart className="text-secondary fill-secondary" size={24} />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              PetfinderPro
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        {menuItems.slice(0, 4).map((item) => (
          <NavbarItem key={item.name}>
            <Link color="foreground" href={item.href} className="hover:text-primary transition-colors font-medium">
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {!isLoading && (
          <>
            {!user ? (
              <>
                <NavbarItem className="hidden lg:flex">
                  <Link href="/sign-in">Login</Link>
                </NavbarItem>
                <NavbarItem>
                  <Button as={Link} color="primary" href="/sign-up" variant="flat" className="font-semibold">
                    Sign Up
                  </Button>
                </NavbarItem>
              </>
            ) : (
              <>
                {/* List Pet Button */}
                <NavbarItem className="hidden md:flex">
                  <Button
                    as={Link}
                    href="/pet/create"
                    color="secondary"
                    variant="flat"
                    startContent={<Plus size={18} />}
                    className="font-semibold bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200"
                  >
                    List a Pet
                  </Button>
                </NavbarItem>

                {/* User Avatar Dropdown */}
                <NavbarItem>
                  <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                      <Avatar
                        as="button"
                        className="transition-transform cursor-pointer"
                        color="primary"
                        name={user.email}
                        size="sm"
                        src={user.user_metadata?.avatar_url}
                      />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                      <DropdownItem key="profile" className="h-14 gap-2">
                        <p className="font-semibold">Signed in as</p>
                        <p className="font-semibold">{user.email}</p>
                      </DropdownItem>
                      <DropdownItem key="profile_page" href="/profile">
                        <div className="flex items-center gap-2">
                          <UserIcon size={16} />
                          Profile
                        </div>
                      </DropdownItem>
                      <DropdownItem key="my_pets" href="/my-pets">
                        <div className="flex items-center gap-2">
                          <List size={16} />
                          My Listed Pets
                        </div>
                      </DropdownItem>
                      <DropdownItem key="list_pet" href="/pet/create" className="md:hidden">
                        <div className="flex items-center gap-2">
                          <PawPrint size={16} />
                          List a Pet
                        </div>
                      </DropdownItem>
                      <DropdownItem key="logout" color="danger" onClick={handleSignOut}>
                        <div className="flex items-center gap-2">
                          <LogOut size={16} />
                          Sign Out
                        </div>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </NavbarItem>
              </>
            )}
          </>
        )}
      </NavbarContent>

      <NavbarMenu className="pt-6">
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color="foreground"
              className="w-full text-xl py-2"
              href={item.href}
              size="lg"
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextUINavbar>
  );
};
