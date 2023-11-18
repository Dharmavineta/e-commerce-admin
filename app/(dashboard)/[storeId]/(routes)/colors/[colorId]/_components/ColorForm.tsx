"use client";
import { Billboard, Color } from "@prisma/client";
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
  color: Color | null;
};

const colorSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Color name must be more than 3 characters long" }),
  colorValue: z
    .string()
    .min(4)
    .regex(/^#/, { message: "String must be a valid color hex code" }),
});

export type colorFormType = z.infer<typeof colorSchema>;

const ColorForm: FC<props> = ({ color }) => {
  console.log(color);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const title = color ? "Edit color" : "Create color";
  const toastMessage = color
    ? "color edited successfully"
    : "color created successfully";
  const description = color ? "Edit a color" : "Create new color";
  const buttonAction = color ? "Save Changes" : "Create color";

  const form = useForm<colorFormType>({
    resolver: zodResolver(colorSchema),
    defaultValues: color || {
      name: "",
      colorValue: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleForm = async (value: colorFormType) => {
    try {
      if (color) {
        await axios.patch(`/api/${params.storeId}/colors/${color.id}`, value);
        toast.success("color edited successfully");
        router.refresh();
        router.push(`/${params.storeId}/colors`);
      } else {
        const data = await axios.post(`/api/${params.storeId}/colors`, value);
        toast.success("color created successfully");
        router.refresh();
        router.push(`/${params.storeId}/colors`);
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
        `/api/${params.storeId}/colors/${params.colorId}`
      );
      if (res.status === 200) {
        router.refresh();
        router.push(`/${params.storeId}/colors`);
        toast.success("color deleted successfully");
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
        {color && (
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
                    placeholder="Color Label"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormDescription>
                  This will be your color&apos;s name
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            name="colorValue"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-x-4">
                    <Input
                      {...field}
                      placeholder="Color Value"
                      disabled={isLoading}
                    />
                    <div
                      className="border p-4 rounded-full"
                      style={{ backgroundColor: field.value }}
                    />
                  </div>
                </FormControl>
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

export default ColorForm;
