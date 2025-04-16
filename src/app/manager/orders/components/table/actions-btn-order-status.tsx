import { OrderStatusKey } from "@/api/OrderApi";
import { Button } from "@/components/ui/button";
import { CheckCircle, Info, Send } from "lucide-react";

interface ButtonOrderStatusActionProps {
  status: OrderStatusKey;
  onClick: () => void;
}

export function ButtonOrderStatusAction({ status, onClick }: ButtonOrderStatusActionProps) {
  switch (status) {
    case "PENDING":
      return (
        <Button title="Send" variant="ghost" onClick={onClick}>
          <Send className="text-green-400" />
          Send
        </Button>
      );
    case "PROCESSING":
      return (
        <Button title="Approve" variant="ghost" onClick={onClick}>
          <CheckCircle className="text-indigo-400" />
          Approve
        </Button>
      );
    case "FAILED":
      return (
        <Button title="Report" variant="ghost" onClick={onClick}>
          <Info className="text-rose-400" />
          Report
        </Button>
      );
    case "DELIVERED":
      return (
        <Button title="Mark Completed" variant="ghost" onClick={onClick}>
          <CheckCircle className="text-indigo-400" />
          Mark Completed
        </Button>
      );

    default:
      return null;
  }
}
