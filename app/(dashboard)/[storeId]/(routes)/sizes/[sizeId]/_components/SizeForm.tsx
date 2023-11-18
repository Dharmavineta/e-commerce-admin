"use client";
import { Size } from "@prisma/client";
import React, { FC, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Heading from "@/components/common/Heading";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import DeleteModal from "./DeleteModal";

type props = {
  size: Size | null;
};

const sizeSchema = z.object({
  name: z
    .string()
    .min(3, { message: "size name must be more than 3 characters long" }),
  sizeValue: z.string().min(1),
});

export type sizeFormType = z.infer<typeof sizeSchema>;

const SizeForm: FC<props> = ({ size }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const title = size ? "Edit size" : "Create size";
  const toastMessage = size
    ? "size edited successfully"
    : "size created successfully";
  const description = size ? "Edit a size" : "Create new size";
  const buttonAction = size ? "Save Changes" : "Create size";

  const form = useForm<sizeFormType>({
    resolver: zodResolver(sizeSchema),
    defaultValues: size || {
      name: "",
      sizeValue: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleForm = async (value: sizeFormType) => {
    try {
      if (size) {
        await axios.patch(`/api/${params.storeId}/sizes/${size.id}`, value);
        toast.success("size edited successfully");
        router.refresh();
        router.push(`/${params.storeId}/sizes`);
      } else {
        const data = await axios.post(`/api/${params.storeId}/sizes`, value);
        toast.success("size created successfully");
        router.refresh();
        router.push(`/${params.storeId}/sizes`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Oops, something went wrong, pls try again later");
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(
        `/api/${params.storeId}/sizes/${params.sizeId}`
      );
      if (res.status === 200) {
        router.refresh();
        router.push(`/${params.storeId}/sizes`);
        toast.success("size deleted successfully");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Oops, something went wrong, pls try again later");
    }
  };
  return (
    <div>
      <DeleteModal
        isOpen={open}
        onConfirm={handleDelete}
        onClose={() => setOpen(false)}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {size && (
          <Button
            className="border border-rose-600"
            variant={"outline"}
            size={"sm"}
            disabled={isLoading}
            onClick={() => setOpen(true)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator className="mt-2" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleForm)}
          className="mt-5 max-w-md w-full space-y-7"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="size Label"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  This will be your size&apos;s name
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            name="sizeValue"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="lg,sm,xl,xxl..."
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>Please provide size value</FormDescription>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" variant={"outline"}>
            {buttonAction}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SizeForm;
