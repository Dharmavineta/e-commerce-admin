"use client";
import React, { FC, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import {
  ArchiveRestore,
  Check,
  ChevronsUpDown,
  Plus,
  Store as StoreIcon,
} from "lucide-react";
import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useSession } from "next-auth/react";

type props = {
  stores: Store[];
};

const SwitchStores: FC<props> = ({ stores = [] }) => {
  const session = useSession();
  const user = session.data?.user;
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const storeModal = useStoreModal();

  const formattedStore = stores.map((store, i, arr) => ({
    storeName: store.name,
    storeId: store.id,
  }));

  const currentStore = formattedStore.find(
    (store) => store.storeId === params.storeId
  );

  const storeSelect = (store: { storeName: string; storeId: string }) => {
    setOpen(false);
    router.push(`/${store.storeId}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className="w-[200px] justify-between shrink-0 text-xs"
        >
          <ArchiveRestore className="w-4 h-4 mr-2" />
          {currentStore?.storeName}
          <ChevronsUpDown className="w-3 h-3 ml-auto opacity-50 " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="relative  left-3 ">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store here..." />
            <CommandEmpty>No store found...</CommandEmpty>
            <CommandGroup
              heading={`${user?.name}'s store`}
              className="space-y-1"
            >
              {formattedStore.map((store) => (
                <CommandItem
                  key={store.storeId}
                  onSelect={() => storeSelect(store)}
                  className="text-sm cursor-pointer py-2"
                >
                  <StoreIcon className="mr-3 h-3 w-3" />
                  {store.storeName}
                  <Check
                    className={cn(
                      "ml-auto h-3 w-3",
                      currentStore?.storeId === store.storeId
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandGroup>
            <CommandItem
              className="cursor-pointer py-2"
              onSelect={() => {
                setOpen(false);
                storeModal.onOpen();
              }}
            >
              Create Store
              <Plus className="ml-auto w-4 h-4" />
            </CommandItem>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SwitchStores;
