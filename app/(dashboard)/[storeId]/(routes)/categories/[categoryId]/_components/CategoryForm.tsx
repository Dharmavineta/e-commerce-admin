"use client";
import { Billboard, Category } from "@prisma/client";
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
import { ImageUpload } from "@/components/image-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeleteModal from "./DeleteModal";

type props = {
  category: Category | null;
  billboards: Billboard[];
};

const categorySchema = z.object({
  label: z
    .string()
    .min(3, { message: "Category name must be more than 3 characters long" }),
  billboardId: z
    .string()
    .min(3, { message: "Image url must be more than 3 characters long" }),
});

export type CategoryFormType = z.infer<typeof categorySchema>;

const CategoryForm: FC<props> = ({ category, billboards }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const title = category ? "Edit category" : "Create category";
  const toastMessage = category
    ? "category edited successfully"
    : "category created successfully";
  const description = category ? "Edit a category" : "Create new category";
  const buttonAction = category ? "Save Changes" : "Create category";

  const form = useForm<CategoryFormType>({
    resolver: zodResolver(categorySchema),
    defaultValues: category || {
      label: "",
      billboardId: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleForm = async (value: CategoryFormType) => {
    try {
      if (category) {
        await axios.patch(
          `/api/${params.storeId}/categories/${category.id}`,
          value
        );
        toast.success("Category edited successfully");
        router.refresh();
        router.push(`/${params.storeId}/categories`);
      } else {
        const data = await axios.post(
          `/api/${params.storeId}/categories`,
          value
        );
        toast.success("Category created successfully");
        router.refresh();
        router.push(`/${params.storeId}/categories`);
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
        `/api/${params.storeId}/categories/${params.categoryId}`
      );
      if (res.status === 200) {
        router.refresh();
        router.push(`/${params.storeId}/categories`);
        toast.success("Category deleted successfully");
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
        {category && (
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
            name="label"
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
                  This will be your Category&apos;s name
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="billboardId"
            render={({ field }) => (
              <FormItem className=" justify-start flex flex-col w-full space-y-4">
                <FormLabel>Billboard</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Select a billboard"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {billboards.map((billboard) => (
                      <SelectItem value={billboard.id} key={billboard.id}>
                        {billboard.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

export default CategoryForm;
