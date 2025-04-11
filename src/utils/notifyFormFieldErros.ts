import { FieldErrors } from "react-hook-form";
import { toast } from "sonner";

export function notifyFormErrors(errors: FieldErrors, prefix = "Please check fields below:") {
  const messages: string[] = [];

  for (const [key, value] of Object.entries(errors)) {
    if (value?.message) {
      messages.push(`${key}: ${value.message}`);
    }
  }

  if (messages.length) {
    toast.error(`${prefix}\n- ${messages.join("\n- ")}`);
  }
}
