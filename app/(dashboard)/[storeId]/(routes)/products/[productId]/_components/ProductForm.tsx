"use client";
import { Category, Color, Image, Product, Size } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeleteModal from "./DeleteModal";
import { Checkbox } from "@/components/ui/checkbox";
import CloudinaryImageUpload from "@/components/Image-upload-cloudinary";

type props = {
  product: (Product & { images: Image[] }) | null;
  colors: Color[];
  categories: Category[];
  sizes: Size[];
};

const productSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be greater than 3 characters long" }),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isHotDeals: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  stock: z.coerce.number().min(1),
});

export type productFormType = z.infer<typeof productSchema>;

const ProductForm: FC<props> = ({ product, colors, categories, sizes }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const title = product ? "Edit product" : "Create product";
  const toastMessage = product
    ? "product edited successfully"
    : "product created successfully";
  const description = product ? "Edit a product" : "Create new product";
  const buttonAction = product ? "Save Changes" : "Create product";

  const form = useForm<productFormType>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? { ...product, price: parseFloat(String(product.price)) }
      : {
          name: "",
          images: [],
          price: 0,
          categoryId: "",
          colorId: "",
          sizeId: "",
          isFeatured: false,
          isArchived: false,
          isHotDeals: false,
          stock: 0,
        },
  });

  const isLoading = form.formState.isSubmitting;

  const handleForm = async (value: productFormType) => {
    try {
      if (product) {
        await axios.patch(
          `/api/${params.storeId}/products/${product.id}`,
          value
        );
        toast.success("Product edited successfully");
        router.refresh();
        router.push(`/${params.storeId}/products`);
      } else {
        const data = await axios.post(`/api/${params.storeId}/products`, value);
        toast.success("Product created successfully");
        router.refresh();
        router.push(`/${params.storeId}/products`);
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
        `/api/${params.storeId}/products/${params.productId}`
      );
      if (res.status === 200) {
        router.refresh();
        router.push(`/${params.storeId}/products`);
        toast.success("Product deleted successfully");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Oops, something went wrong, pls try again later");
    }
  };
  return (
    <div className="w-full ">
      <DeleteModal
        isOpen={open}
        onConfirm={handleDelete}
        onClose={() => setOpen(false)}
        loading={loading}
      />
      <div className="flex items-center justify-between w-full">
        <Heading title={title} description={description} />
        {product && (
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
          className="mt-5 space-y-7"
        >
          <FormField
            name="images"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <CloudinaryImageUpload
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    value={field.value.map((img) => img.url)}
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((curr) => curr.url !== url),
                      ])
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="w-full gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                    This will be your product&apos;s name
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
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
                          placeholder="Select a Category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem value={category.id} key={category.id}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colors</FormLabel>
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
                          placeholder="Select a Color"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem value={color.id} key={color.id}>
                          <div className="flex gap-x-2 items-center">
                            {color.name}

                            <div
                              style={{
                                background: color.colorValue,
                                width: "15px",
                                height: "15px",
                                borderRadius: "100%",
                              }}
                            />
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sizes</FormLabel>
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
                          placeholder="Select a Size"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((color) => (
                        <SelectItem value={color.id} key={color.id}>
                          <span>{color.name}</span>
                          <span className="font-bold ml-1">
                            ({color.sizeValue})
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Amount"
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter stock.." />
                  </FormControl>
                  <FormDescription>
                    This is the no of items you have in stock
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 border rounded-md p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      Check the Archived if you don&apos;t want the product to
                      appear on home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 border rounded-md p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will be on the featured list of products
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isHotDeals"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 border rounded-md p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="leading-none">
                    <FormLabel>Hot-deals</FormLabel>
                    <FormDescription>
                      This product will be on the hot-deals list of products
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="flex md:justify-end ">
            <Button
              disabled={isLoading}
              type="submit"
              className="w-full lg:w-fit"
            >
              {buttonAction}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;
