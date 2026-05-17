import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CardLayout } from "./CardLayout";
import { InfoValue } from "./InfoValue";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useInformation } from "@/hooks/raid/useInformation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/common/LoadingButton";

export const ContactMail = () => {
  const { information, updateInformation } = useInformation();
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    email: z.string().email({
      message: "Veuillez renseigner une adresse email valide",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: information?.contact ?? undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    updateInformation(
      {
        ...information,
        contact: values.email,
      },
      () => {
        setIsLoading(false);
        setIsEdit(false);
        form.reset({ email: values.email });
      }
    );
  }

  function toggleEdit() {
    setIsEdit(!isEdit);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardLayout label="Contact">
          {isEdit ? (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="items-center gap-4">
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEdit(false)}
                  type="button"
                >
                  Annuler
                </Button>
                <LoadingButton
                  size="sm"
                  type="submit"
                  isLoading={isLoading}
                >
                  Valider
                </LoadingButton>
              </div>
            </>
          ) : (
            <>
              <InfoValue
                isEmpty={!information?.contact}
                placeholder="Aucun contact"
                value={information?.contact ?? ""}
                className="break-all"
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                type="button"
                onClick={toggleEdit}
              >
                Modifier
              </Button>
            </>
          )}
        </CardLayout>
      </form>
    </Form>
  );
};
