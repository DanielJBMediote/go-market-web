import { useProductCommentsQuery } from "@/hooks/products/comments/queries";
import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { CommentForm } from "./comment-form";

export function ProductComments() {
  const { id } = useParams();
  const prodId = Number(id);

  const { data, refetch } = useProductCommentsQuery({ id: prodId });

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="pt-8 space-y-2">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      <CommentForm />
      {data.length === 0 ? (
        <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {data.map((prodComment) => (
            <div key={prodComment.id} className="flex space-x-3 mb-4">
              {/* Avatar do usuário */}
              <div className="flex-shrink-0 mt-3">
                <Image
                  src={"/default-avatar.png"}
                  className="h-12 w-12 rounded-full object-cover"
                  alt={prodComment.comment.user.username}
                  width={128}
                  height={128}
                />
              </div>

              {/* Conteúdo do comentário */}
              <div className="flex-1">
                <span className="text-sm font-semibold text-indigo-400">
                  @{prodComment.comment.user.username}
                </span>
                <div className="relative bg-secondary dark:bg-gray-700 p-3 rounded-bl-2xl rounded-tr-2xl rounded-br-2xl min-h-16">
                  {/* Cabeçalho com nome e tempo */}
                  <span className="absolute flex gap-1 items-center -top-5 right-3 text-xs text-muted-foreground dark:text-gray-400">
                    <Clock size={12} />
                    {formatDistanceToNow(new Date(prodComment.comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>

                  {/* Texto do comentário */}
                  <p className="text-sm">{prodComment.comment.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
