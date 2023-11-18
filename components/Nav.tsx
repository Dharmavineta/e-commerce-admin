"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React, { FC, HTMLAttributes, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  GalleryThumbnails,
  LucideArrowUpDown,
  Paintbrush,
  Scaling,
  SendToBack,
  Settings,
  Shapes,
  ShoppingBasket,
  Store,
} from "lucide-react";

type props = HTMLAttributes<HTMLElement>;

const Nav: FC<props> = ({ className, ...props }) => {
  const pathName = usePathname();
  const params = useParams();
  const routes = [
    {
      label: "Overview",
      href: `/${params.storeId}`,
      active: pathName === `/${params.storeId}`,
      icon: Store,
    },
    {
      label: "Billboards",
      href: `/${params.storeId}/billboards`,
      active: pathName === `/${params.storeId}/billboards`,
      icon: GalleryThumbnails,
    },
    {
      label: "Categories",
      href: `/${params.storeId}/categories`,
      active: pathName === `/${params.storeId}/categories`,
      icon: Shapes,
    },
    {
      label: "Sizes",
      href: `/${params.storeId}/sizes`,
      active: pathName === `/${params.storeId}/sizes`,
      icon: Scaling,
    },
    {
      label: "Colors",
      href: `/${params.storeId}/colors`,
      active: pathName === `/${params.storeId}/colors`,
      icon: Paintbrush,
    },
    {
      label: "Products",
      href: `/${params.storeId}/products`,
      active: pathName === `/${params.storeId}/products`,
      icon: ShoppingBasket,
    },
    {
      label: "Orders",
      href: `/${params.storeId}/orders`,
      active: pathName === `/${params.storeId}/orders`,
      icon: SendToBack,
    },
    {
      label: "Settings",
      href: `/${params.storeId}/settings`,
      active: pathName === `/${params.storeId}/settings`,
      icon: Settings,
    },
  ];

  return (
    <>
      <nav className=" gap-5 hidden lg:flex ">
        {routes.map((route, i, arr) => (
          <Link
            href={route.href}
            key={route.href}
            className={cn(
              "text-sm transition-all hover:text-primary",
              route.active ? "text-black" : "text-muted-foreground"
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
      <nav className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="text-xs">
              Menu
              <LucideArrowUpDown className="w-3 h-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[180px] relative left-10">
            <DropdownMenuLabel className="text-muted-foreground font-normal text-xs">
              Store Links
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="space-y-2">
              {routes.map((route, i, arr) => (
                <DropdownMenuItem key={route.href}>
                  <Link
                    className={cn(
                      "w-full flex  group",
                      route.active ? "text-black" : "text-muted-foreground"
                    )}
                    href={route.href}
                  >
                    <route.icon className="w-4 h-4 mr-3" />
                    <span
                      className={cn(
                        "text-sm transition-all group-hover:text-primary"
                      )}
                    >
                      {route.label}
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </>
  );
};

export default Nav;
