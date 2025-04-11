import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthentication } from "@/contexts/auth-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInSchema = z.object({
  username: z.string(),
  password: z.string(),
});

type SignInType = z.infer<typeof signInSchema>;

export function SignInForm() {
  const { login } = useAuthentication();

  const methods = useForm({
    resolver: zodResolver(signInSchema),
  });

  async function handleSignIn(data: SignInType) {
    await login(data);
  }

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSignIn)}
        className="grid grid-cols-3 w-2/3 place-self-center space-y-4"
      >
        <FormItem className="col-span-3">
          <FormLabel className="text-sm text-foreground" htmlFor="username">
            Username
          </FormLabel>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            {...methods.register("username")}
          />
        </FormItem>
        <FormItem className="col-span-3">
          <FormLabel className="text-sm text-foreground" htmlFor="password">
            Password
          </FormLabel>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password here"
            {...methods.register("password")}
          />
        </FormItem>
        <Button
          className="col-span-3"
          disabled={methods.formState.isSubmitting}
          isLoading={methods.formState.isSubmitting}
        >
          Sign In
        </Button>
      </form>
    </Form>
  );
}
