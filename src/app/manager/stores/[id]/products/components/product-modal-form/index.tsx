import { ICategoryApi } from "@/api/CategoryApi";
import { IProductApi, IProductFileApi } from "@/api/ProductApi";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProductMutation } from "@/hooks/products/mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package } from "lucide-react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CategorySelectFormItem } from "./category-select-field";
import { ProductImagesFieldItem } from "./images-field";

const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1).max(255),
  price: z.number().min(0),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  category: z.custom<ICategoryApi>(),
  files: z.array(z.instanceof(File)).default([]), // Mudamos para array de Files
  images: z.array(z.custom<IProductFileApi>()).default([]), // Para imagens já existentes
});

export type ProductTypeSchema = z.infer<typeof createProductSchema>;

interface ProductFormModalProps {
  initialData?: IProductApi;
}

export function ProductFormModal({ initialData }: ProductFormModalProps) {
  const { id } = useParams();
  const storeId = Number(id);

  // const images = initialData?.images.map((pf) => pf.file) || [];

  const methods = useForm({
    resolver: zodResolver<ProductTypeSchema>(createProductSchema),
    defaultValues: { ...initialData },
  });

  const { mutateAsync } = useProductMutation({ initialData, storeId });

  async function handleSubmitStore(data: ProductTypeSchema) {
    console.log(data);
    await mutateAsync(data);
    methods.reset();
  }

  const errors = methods.formState.errors;

  return (
    <DialogContent className="min-w-4xl">
      <DialogTitle className="flex gap-2 items-center">
        <Package />
        {initialData ? `${initialData.name}` : "Create new product"}
      </DialogTitle>
      <DialogDescription>
        {initialData ? "Edit the product details." : "Add a new product to the store."}
      </DialogDescription>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmitStore)} className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            <FormItem className="col-span-3 space-y-1">
              <FormLabel>Name</FormLabel>
              <Input placeholder="Type the name of store here" {...methods.register("name")} />
            </FormItem>
            <FormItem className="col-span-3 space-y-1">
              <FormLabel>Description</FormLabel>
              <Textarea
                placeholder="Type the description here"
                {...methods.register("description")}
              />
            </FormItem>
            <FormItem className="col-span-3 space-y-1">
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                placeholder="Type the price here"
                min={0}
                step={0.01}
                {...methods.register("price", { valueAsNumber: true })}
              />
              <FormMessage>{methods.getFieldState("price").error?.message}</FormMessage>
            </FormItem>
            <CategorySelectFormItem />
          </div>
          <div className="flex flex-col gap-2">
            <ProductImagesFieldItem />
            {initialData && (
              <>
                <FormField
                  name="isActive"
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem className="flex gap-2 items-baseline col-span-3 space-y-1">
                      <FormControl>
                        <Checkbox
                          id="isActive"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          {...methods.register("isActive")}
                        />
                      </FormControl>
                      <FormLabel htmlFor="isActive">Active/Inactive this product.</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  name="isFeatured"
                  control={methods.control}
                  render={({ field }) => (
                    <FormItem className="flex gap-2 items-baseline col-span-3 space-y-1">
                      <FormControl>
                        <Checkbox
                          id="isFeatured"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          {...methods.register("isFeatured")}
                        />
                      </FormControl>
                      <FormLabel htmlFor="isFeatured">Enable this product to feature.</FormLabel>
                    </FormItem>
                  )}
                />
              </>
            )}
            {Object.entries({
              name: "Name",
              description: "Description",
              categoryId: "Category",
              images: "Images",
              isActive: "isActive",
              isFeatured: "isFeatured",
            } as const).map(
              ([field, label]) =>
                errors[field as keyof typeof errors]?.message && (
                  <FormMessage key={field} className="col-span-3">
                    {`Field '${label}': ${errors[field as keyof typeof errors]!.message}`}
                  </FormMessage>
                )
            )}
          </div>
          <Button
            type="submit"
            className="col-span-3"
            disabled={methods.formState.isSubmitting}
            isLoading={methods.formState.isSubmitting}
          >
            {initialData ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
      {/* <DialogClose onClick={} /> */}
    </DialogContent>
  );
}
