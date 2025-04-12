import { ProductInstaceApi } from "@/api/ProductApi";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const commentSchema = z.object({
  comment: z.string().min(1),
});

type CommentFormData = z.infer<typeof commentSchema>;

export function CommentForm() {
  const { id } = useParams();
  const prodId = Number(id);

  const queryClient = useQueryClient();

  const methods = useForm({
    resolver: zodResolver(commentSchema),
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (data: CommentFormData) => {
      await ProductInstaceApi.createComment(prodId, data.comment);
    },
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ["products-comments", { id: prodId }] });
      methods.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function handleCreateComment(data: CommentFormData) {
    mutateAsync(data);
  }

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(handleCreateComment)} className="space-y-2 ">
        <Textarea
          placeholder="Comment something about product..."
          minLength={1}
          {...methods.register("comment")}
        />
        <Button>
          <Send />
          Comment
        </Button>
      </form>
    </Form>
  );
}
