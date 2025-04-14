import { IFileApi } from "@/api/FileApi";
import { IStoreApi, StoreInstanceApi } from "@/api/StoreApi";
import { Where } from "@/api/Where";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModalContext } from "@/contexts/modal-provider";
import { useStoreMutation } from "@/hooks/stores/mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Store, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const createStoreSchema = z.object({
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().min(1),
  isActive: z.boolean().default(true),
  logo: z.custom<IFileApi>().nullable(),
  file: z.custom<File>().optional(),
});

export type CreateStoreType = z.infer<typeof createStoreSchema>;

interface StoreFormModalProps {
  initialData?: IStoreApi;
}

export function StoreFormModal({ initialData }: StoreFormModalProps) {
  const { closeModal } = useModalContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const methods = useForm({
    resolver: zodResolver(createStoreSchema),
    defaultValues: { ...initialData },
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingLogo, setExistingLogo] = useState<IFileApi | null>(methods.getValues("logo"));

  const { mutateAsync } = useStoreMutation({ initialData });

  async function handleCreateStore(data: CreateStoreType) {
    await mutateAsync(data);
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      methods.setValue("file", file);

      // Cria URLs de preview
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
    }
  };

  function removeFilePreviw() {
    methods.setValue("file", undefined);
    setPreviewUrl(null);
  }

  function removeExistingImage() {
    methods.setValue("logo", null);
    setExistingLogo(null);
  }

  const handleClick = () => {
    if (existingLogo) {
      removeExistingImage();
    } else if (previewUrl) {
      removeFilePreviw();
    } else {
      fileInputRef.current?.click();
    }
  };

  function debounce<F extends (...args: unknown[]) => void>(
    func: F,
    wait: number
  ): (...args: Parameters<F>) => void {
    let timeout: ReturnType<typeof setTimeout>;
    return function (...args: Parameters<F>) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  async function handleCheckAvaliableName() {
    const name = methods.getValues("name");
    const where = new Where();
    where.addCondition("name", name, "EQUALS");
    if (initialData) {
      where.addCondition("id", initialData.id, "NOT");
    }

    const response = await StoreInstanceApi.fetchAll(where);
    const { data } = response.data;

    if (data.length > 0) {
      methods.setError("name", { message: "This store name already exists." });
    }
  }

  const debouncedCheckAvaliableName = debounce(handleCheckAvaliableName, 2000); // 2000ms = 2 segu

  return (
    <DialogContent>
      <DialogTitle className="flex gap-2 items-center">
        <Store />
        {`${initialData ? initialData.name : "Create new Store"}`}
      </DialogTitle>
      <DialogDescription>
        {initialData ? "Edit the store details." : "Add a new store to the store."}
      </DialogDescription>
      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleCreateStore)}
          className="grid grid-cols-3 gap-y-4"
        >
          <FormItem>
            {existingLogo && (
              <div key={existingLogo.id} className="relative group shrink-0">
                <Image
                  src={`${API_URL}/files/${existingLogo.uuid}`}
                  alt={`Store Logo`}
                  width={100}
                  height={100}
                  className="w-24 h-24 object-contain border p-2"
                />
              </div>
            )}
            {previewUrl && (
              <div key={previewUrl} className="relative group shrink-0">
                <Image
                  src={previewUrl}
                  alt={`Preview Logo`}
                  width={100}
                  height={100}
                  className="w-32 h-32 object-contain border p-2"
                />
              </div>
            )}
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              placeholder="Select an logo"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant={existingLogo || previewUrl ? "destructive" : "default"}
              onClick={handleClick}
            >
              {!existingLogo && !previewUrl ? (
                <>
                  <Plus />
                  Add Image
                </>
              ) : (
                <>
                  <X />
                  Remove Image
                </>
              )}
            </Button>
          </FormItem>
          <FormItem className="col-span-3 space-y-1">
            <FormLabel>Name</FormLabel>
            <Input
              {...methods.register("name")}
              placeholder="Type the name of store here"
              onChange={(e) => {
                methods.setValue("name", e.target.value);
                debouncedCheckAvaliableName();
              }}
            />
            <FormMessage>{methods.getFieldState("name").error?.message}</FormMessage>
          </FormItem>
          <FormItem className="col-span-3 space-y-1 relative">
            <FormLabel>Slug</FormLabel>
            <Input {...methods.register("slug")} placeholder="Type a slug here" />
            <span className="absolute top-10 right-4 text-xs">(Optional)</span>
          </FormItem>
          <FormItem className="col-span-3 space-y-1">
            <FormLabel>Description</FormLabel>
            <Input {...methods.register("description")} placeholder="Type the description here" />
          </FormItem>
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
                <FormLabel htmlFor="isActive">Active/Inactive this store.</FormLabel>
              </FormItem>
            )}
          />
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
      <DialogClose onClick={() => closeModal()} />
    </DialogContent>
  );
}
