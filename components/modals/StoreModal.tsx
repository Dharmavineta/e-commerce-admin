"use client";
import React, { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useStoreModal } from "@/hooks/use-store-modal";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Ring } from "@uiball/loaders";
import axios from "axios";
import { toast } from "sonner";

const createStoreSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Store name must be greater than 3 characters long" }),
});

export type createStoreType = z.infer<typeof createStoreSchema>;

const StoreModal = () => {
  const modal = useStoreModal();
  const form = useForm<createStoreType>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: "",
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      modal.onClose();
    }
  };

  const isLoading = form.formState.isSubmitting;

  const handleStore = async (values: createStoreType) => {
    try {
      const res = await axios.post("/api/store", values);
      if (res.status === 201) {
        toast.success("Store successfully created");
        window.location.assign(`/${res.data.id}`);
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        return toast.error("Unauthorised, user required");
      } else if (error.response.status === 400) {
        return toast.error("Store name required");
      } else {
        return toast.error("Internal server error");
      }
    }
  };
  return (
    <Dialog open={modal.isOpen} onOpenChange={onChange}>
      <DialogContent className="max-w-md  md:max-w-xl lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-start text-base">
            Create store
          </DialogTitle>
          <DialogDescription className="text-start text-muted-foreground text-sm">
            Please choose a name for your store
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleStore)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        placeholder="Enter Store name..."
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      This will be your default store name, you can always
                      change it later
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mt-10 flex justify-end gap-5 w-full">
                <Button
                  type="button"
                  variant={"outline"}
                  onClick={modal.onClose}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-500"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Ring color="white" size={25} />
                  ) : (
                    <p className="">Create Store</p>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoreModal;
