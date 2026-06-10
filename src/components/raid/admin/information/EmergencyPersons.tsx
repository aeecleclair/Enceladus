import { PersonField } from "../../custom/PersonField";
import { CardLayout } from "./CardLayout";

import { LoadingButton } from "@/components/common/LoadingButton";
import { useInformation } from "@/hooks/raid/useInformation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { HiCheck } from "react-icons/hi";
import { z } from "zod";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import PhoneInput from "react-phone-input-2";

export const EmergencyPerson = () => {
  const { information, updateInformation } = useInformation();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpened, setIsOpened] = useState(false);

  function toggleEdit() {
    setIsOpened((prev) => !prev);
  }

  const formSchema = z.object({
    president: z
      .object({
        firstname: z.string().min(1, {
          message: "Veuillez renseigner votre prénom",
        }),
        name: z.string().min(1, {
          message: "Veuillez renseigner votre nom",
        }),
        phone: z
          .string({
            error: "Veuillez renseigner un numéro de téléphone",
          })
          .refine(
            (value) => {
              if (value === "+33" || value === "") {
                return true;
              }
              if (value.length < 10 || value.length > 14) {
                return false;
              }
              return true;
            },
            { message: "Veuillez renseigner un numéro de téléphone valide" },
          ),
      })
      .partial(),
    volunteer_responsible: z
      .object({
        firstname: z.string().min(1, {
          message: "Veuillez renseigner votre prénom",
        }),
        name: z.string().min(1, {
          message: "Veuillez renseigner votre nom",
        }),
        phone: z
          .string({
            error: "Veuillez renseigner un numéro de téléphone",
          })
          .refine(
            (value) => {
              if (value === "+33" || value === "") {
                return true;
              }
              if (value.length < 10 || value.length > 14) {
                return false;
              }
              return true;
            },
            { message: "Veuillez renseigner un numéro de téléphone valide" },
          ),
      })
      .partial(),
    security_responsible: z
      .object({
        firstname: z.string().min(1, {
          message: "Veuillez renseigner votre prénom",
        }),
        name: z.string().min(1, {
          message: "Veuillez renseigner votre nom",
        }),
        phone: z
          .string({
            error: "Veuillez renseigner un numéro de téléphone",
          })
          .refine(
            (value) => {
              if (value === "+33" || value === "") {
                return true;
              }
              if (value.length < 10 || value.length > 14) {
                return false;
              }
              return true;
            },
            { message: "Veuillez renseigner un numéro de téléphone valide" },
          ),
      })
      .partial(),
    rescue: z
      .object({
        phone: z
          .string({
            error: "Veuillez renseigner un numéro de téléphone",
          })
          .refine(
            (value) => {
              if (value === "+33" || value === "") {
                return true;
              }
              if (value.length < 10 || value.length > 14) {
                return false;
              }
              return true;
            },
            { message: "Veuillez renseigner un numéro de téléphone valide" },
          ),
      })
      .partial(),
  });

  function getPhone(value?: string): string {
    if (!value) {
      return "";
    }
    if (value.startsWith("0")) {
      return `+33 ${value.slice(1)}`;
    }
    return value;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      president: {
        firstname: information?.president?.firstname ?? undefined,
        name: information?.president?.name ?? undefined,
        phone: getPhone(information?.president?.phone ?? ""),
      },
      volunteer_responsible: {
        firstname: information?.volunteer_responsible?.firstname ?? undefined,
        name: information?.volunteer_responsible?.name ?? undefined,
        phone: getPhone(information?.volunteer_responsible?.phone ?? ""),
      },
      security_responsible: {
        firstname: information?.security_responsible?.firstname ?? undefined,
        name: information?.security_responsible?.name ?? undefined,
        phone: getPhone(information?.security_responsible?.phone ?? ""),
      },
      rescue: {
        phone: getPhone(information?.rescue?.phone ?? ""),
      },
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    updateInformation(
      {
        ...information,
        president: {
          firstname: values.president.firstname,
          name: values.president.name,
          phone: values.president.phone,
        },
        volunteer_responsible: {
          firstname: values.volunteer_responsible.firstname,
          name: values.volunteer_responsible.name,
          phone: values.volunteer_responsible.phone,
        },
        security_responsible: {
          firstname: values.security_responsible.firstname,
          name: values.security_responsible.name,
          phone: values.security_responsible.phone,
        },
        rescue: {
          phone: values.rescue.phone,
        },
      },
      () => {
        setIsLoading(false);
        setIsOpened(false);
        form.reset({
          president: {
            firstname: values.president.firstname,
            name: values.president.name,
            phone: getPhone(values.president.phone),
          },
          volunteer_responsible: {
            firstname: values.volunteer_responsible.firstname,
            name: values.volunteer_responsible.name,
            phone: getPhone(values.volunteer_responsible.phone),
          },
          security_responsible: {
            firstname: values.security_responsible.firstname,
            name: values.security_responsible.name,
            phone: getPhone(values.security_responsible.phone),
          },
          rescue: {
            phone: getPhone(values.rescue.phone),
          },
        });
      },
    );
  }

  const isPresidentFilled = () => {
    return (
      form.watch("president.firstname") &&
      form.watch("president.name") &&
      form.watch("president.phone")
    );
  };

  const isVolunteerResponsibleFilled = () => {
    return (
      form.watch("volunteer_responsible.firstname") &&
      form.watch("volunteer_responsible.name") &&
      form.watch("volunteer_responsible.phone")
    );
  };

  const isSecurityResponsibleFilled = () => {
    return (
      form.watch("security_responsible.firstname") &&
      form.watch("security_responsible.name") &&
      form.watch("security_responsible.phone")
    );
  };

  const isRescueFilled = () => {
    return form.watch("rescue.phone");
  };

  const numberOfFilledPerson = () => {
    let count = 0;
    if (isPresidentFilled()) {
      count++;
    }
    if (isVolunteerResponsibleFilled()) {
      count++;
    }
    if (isSecurityResponsibleFilled()) {
      count++;
    }
    if (isRescueFilled()) {
      count++;
    }
    return count;
  };

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <CardLayout label="Personnes à contacter en cas d'urgence">
        <div className="text-2xl font-bold">
          {`${numberOfFilledPerson()}/4 remplis`}
        </div>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="mt-4 w-30"
            type="button"
            onClick={toggleEdit}
          >
            Modifier
          </Button>
        </DialogTrigger>
      </CardLayout>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>Contacts importants</DialogTitle>
          <DialogDescription>
            {
              "Les personnes que les participants doivent contacter en cas d'urgence."
            }
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Accordion type="single" collapsible>
              <AccordionItem value="president">
                <AccordionTrigger>
                  <div className="flex flex-row mr-auto items-center">
                    {isPresidentFilled() && <HiCheck className="mr-4" />}
                    {"Président·e"}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-6 py-4 mr-2">
                    <PersonField
                      form={form}
                      label="Prénom"
                      id="president.firstname"
                      placeholder="Prénom"
                    />
                    <PersonField
                      form={form}
                      label="Nom"
                      id="president.name"
                      placeholder="Nom"
                    />
                    <FormField
                      control={form.control}
                      name="president.phone"
                      render={() => (
                        <FormItem>
                          <div className="grid grid-cols-5 items-center gap-4">
                            <FormLabel className="text-right">
                              Téléphone
                            </FormLabel>
                            <div className="col-span-4">
                              <FormMessage />
                              <Controller
                                name="president.phone"
                                control={form.control}
                                render={({ field: { onChange, value } }) => (
                                  <PhoneInput
                                    value={value}
                                    onChange={onChange}
                                    country={"fr"}
                                    specialLabel=""
                                    placeholder="+33 6 06 06 06 06"
                                    inputClass="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    dropdownClass="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="volunteer_responsible">
                <AccordionTrigger>
                  <div className="flex flex-row mr-auto items-center">
                    {isVolunteerResponsibleFilled() && (
                      <HiCheck className="mr-4" />
                    )}
                    {"Responsable Bénévole"}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-6 py-4 mr-2">
                    <PersonField
                      form={form}
                      label="Prénom"
                      id="volunteer_responsible.firstname"
                      placeholder="Prénom"
                    />
                    <PersonField
                      form={form}
                      label="Nom"
                      id="volunteer_responsible.name"
                      placeholder="Nom"
                    />
                    <FormField
                      control={form.control}
                      name="volunteer_responsible.phone"
                      render={() => (
                        <FormItem>
                          <div className="grid grid-cols-5 items-center gap-4">
                            <FormLabel className="text-right">
                              Téléphone
                            </FormLabel>
                            <div className="col-span-4">
                              <FormMessage />
                              <Controller
                                name="volunteer_responsible.phone"
                                control={form.control}
                                render={({ field: { onChange, value } }) => (
                                  <PhoneInput
                                    value={value}
                                    onChange={onChange}
                                    country={"fr"}
                                    specialLabel=""
                                    placeholder="+33 6 06 06 06 06"
                                    inputClass="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    dropdownClass="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="security_responsible">
                <AccordionTrigger>
                  <div className="flex flex-row mr-auto items-center">
                    {isSecurityResponsibleFilled() && (
                      <HiCheck className="mr-4" />
                    )}
                    {"Responsable Sécurité"}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-6 py-4 mr-2">
                    <PersonField
                      form={form}
                      label="Prénom"
                      id="security_responsible.firstname"
                      placeholder="Prénom"
                    />
                    <PersonField
                      form={form}
                      label="Nom"
                      id="security_responsible.name"
                      placeholder="Nom"
                    />
                    <FormField
                      control={form.control}
                      name="security_responsible.phone"
                      render={() => (
                        <FormItem>
                          <div className="grid grid-cols-5 items-center gap-4">
                            <FormLabel className="text-right">
                              Téléphone
                            </FormLabel>
                            <div className="col-span-4">
                              <FormMessage />
                              <Controller
                                name="security_responsible.phone"
                                control={form.control}
                                render={({ field: { onChange, value } }) => (
                                  <PhoneInput
                                    value={value}
                                    onChange={onChange}
                                    country={"fr"}
                                    specialLabel=""
                                    placeholder="+33 6 06 06 06 06"
                                    inputClass="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    dropdownClass="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="rescue">
                <AccordionTrigger>
                  <div className="flex flex-row mr-auto items-center">
                    {isRescueFilled() && <HiCheck className="mr-4" />}
                    {"Secouristes"}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-6 py-4 mr-2">
                    <FormField
                      control={form.control}
                      name="rescue.phone"
                      render={() => (
                        <FormItem>
                          <div className="grid grid-cols-5 items-center gap-4">
                            <FormLabel className="text-right">
                              Téléphone
                            </FormLabel>
                            <div className="col-span-4">
                              <FormMessage />
                              <Controller
                                name="rescue.phone"
                                control={form.control}
                                render={({ field: { onChange, value } }) => (
                                  <PhoneInput
                                    value={value}
                                    onChange={onChange}
                                    country={"fr"}
                                    specialLabel=""
                                    placeholder="+33 6 06 06 06 06"
                                    inputClass="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    dropdownClass="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                                  />
                                )}
                              />
                            </div>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <DialogFooter>
              <LoadingButton
                isLoading={isLoading}
                type="submit"
                className="w-full mt-4"
              >
                Valider
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
