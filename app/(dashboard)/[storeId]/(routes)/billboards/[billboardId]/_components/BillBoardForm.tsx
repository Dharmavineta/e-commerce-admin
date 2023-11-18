"use client";
import { Billboard } from "@prisma/client";
import React, { FC, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import Heading from "@/components/common/Heading";
import { Button } from "@/components/ui/button";
import DeleteModal from "./DeleteModal";
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
import { ImageUpload } from "@/components/image-upload";
import CloudinaryImageUpload from "@/components/Image-upload-cloudinary";

type props = {
  billboard: Billboard | null;
};

const billboardSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Billboard name must be more than 3 characters long" }),
  imageUrl: z
    .string()
    .min(3, { message: "Image url must be more than 3 characters long" }),
});

export type billboardFormType = z.infer<typeof billboardSchema>;

const BillBoardForm: FC<props> = ({ billboard }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const title = billboard ? "Edit Billboard" : "Create Billboard";
  const toastMessage = billboard
    ? "Billboard edited successfully"
    : "Billboard created successfully";
  const description = billboard ? "Edit a Billboard" : "Create new Billboard";
  const buttonAction = billboard ? "Save Changes" : "Create Billboard";

  const form = useForm<billboardFormType>({
    resolver: zodResolver(billboardSchema),
    defaultValues: billboard || {
      name: "",
      imageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleForm = async (value: billboardFormType) => {
    try {
      if (billboard) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${billboard.id}`,
          value
        );
        toast.success("Billboard edited successfully");
        router.refresh();
        router.push(`/${params.storeId}/billboards`);
      } else {
        const data = await axios.post(
          `/api/${params.storeId}/billboards`,
          value
        );
        toast.success("Billboard created successfully");
        router.refresh();
        router.push(`/${params.storeId}/billboards`);
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
        `/api/${params.storeId}/billboards/${params.billboardId}`
      );
      if (res.status === 200) {
        router.refresh();
        router.push(`/${params.storeId}/billboards`);
        toast.success("Billboard deleted successfully");
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
        {billboard && (
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
                    placeholder="Name..."
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  This will be your billboard&apos;s name
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className=" justify-start flex flex-col w-full space-y-4">
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <CloudinaryImageUpload
                    disabled={isLoading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                    value={field.value ? [field.value] : []}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" variant={"outline"}>
            Create Billboard
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BillBoardForm;
