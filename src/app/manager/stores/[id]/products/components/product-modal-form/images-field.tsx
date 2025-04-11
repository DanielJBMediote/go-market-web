import { API_URL } from "@/api";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ProductTypeSchema } from ".";

export function ProductImagesFieldItem() {
  const methods = useFormContext<ProductTypeSchema>();

  // const urlImagesRef = useRef<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const existingImages = useWatch({ name: "images", control: methods.control });

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  // const [existingImages, setExistingImages] = useState<IProductFileApi[]>([]);
  // const [urlImages, setUrlImages] = useState<Record<string, string>>({});

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);

      // Adiciona novos arquivos ao form
      const currentFiles = methods.getValues("files") || [];
      methods.setValue("files", [...currentFiles, ...newFiles] as File[]);

      // Cria URLs de preview
      const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  const removeFile = (index: number) => {
    const currentFiles = [...methods.getValues("files")];
    currentFiles.splice(index, 1);
    methods.setValue("files", currentFiles);

    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]);
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);

    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      methods.getValues("files").forEach((file) => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  function removeExistingImage(index: number) {
    const newImages = [...existingImages]; // vinda do useWatch
    newImages.splice(index, 1);
    methods.setValue("images", newImages);
  }

  // Limpeza de URLs quando o componente desmontar
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <FormItem className="col-span-3 space-y-1">
      <div className="flex flex-col gap-2">
        <FormLabel>Images</FormLabel>
        <div className="flex gap-x-0.5 overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-2xs">
            {/* Preview de imagens existentes */}
            {existingImages &&
              existingImages.map((pf, index) => (
                <div key={pf.id} className="relative group shrink-0">
                  <Image
                    src={`${API_URL}/files/${pf.file.uuid}`}
                    alt={`Product image ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-24 h-24 object-contain border p-2"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0"
                    onClick={() => removeExistingImage(index)}
                  >
                    <X />
                  </Button>
                </div>
              ))}

            {/* Preview de novas imagens */}
            {previewUrls.length > 0 &&
              previewUrls.map((url, index) => (
                <div key={url} className="relative group shrink-0">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-32 h-32 object-contain border p-2"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0"
                    onClick={() => removeFile(index)}
                  >
                    <X />
                  </Button>
                </div>
              ))}
          </div>
        </div>
        <Input
          type="file"
          className="hidden"
          placeholder="Select an image"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <Button type="button" onClick={handleClick}>
          <Plus />
          Add Image
        </Button>
      </div>
    </FormItem>
  );
}
