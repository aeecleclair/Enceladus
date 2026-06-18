"use client";

import { TopBar } from "@/components/raid/admin/TopBar";
import { ContactMail } from "@/components/raid/admin/information/ContactMail";
import { EmergencyPerson } from "@/components/raid/admin/information/EmergencyPersons";
import { InscriptionEnd } from "@/components/raid/admin/information/InscriptionEnd";
import { RaidDate } from "@/components/raid/admin/information/RaidDate";
import { RaidExternalPrice } from "@/components/raid/admin/information/RaidExternalPrice";
import { RaidInformationDocument } from "@/components/raid/admin/information/RaidInformationDocument";
import { RaidRules } from "@/components/raid/admin/information/RaidRules";
import { RaidStudentPrice } from "@/components/raid/admin/information/RaidStudentPrice";
import { TShirtPrice } from "@/components/raid/admin/information/TShirtPrice";
import { useHasRaidPermission } from "@/hooks/raid/useHasRaidPermission";
import { useInformation } from "@/hooks/raid/useInformation";
import { useRouter } from "@/i18n/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InformationPage = () => {
  const { isRaidAdmin } = useHasRaidPermission();
  const router = useRouter();
  const { information } = useInformation();

  if (!isRaidAdmin && typeof window !== "undefined") {
    const redirectUrl = new URL(window.location.href);
    const path = redirectUrl.pathname + redirectUrl.search;
    router.replace(`/?redirect=${path}`);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <TopBar />
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion
              type="multiple"
              defaultValue={["date", "price", "contact", "files"]}
            >
              <AccordionItem value="date">
                <AccordionTrigger>Dates</AccordionTrigger>
                <AccordionContent>
                  <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full grid-cols-1 max-md:p-8 max-md:gap-4">
                    <InscriptionEnd />
                    <RaidDate />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="price">
                <AccordionTrigger>Prix</AccordionTrigger>
                <AccordionContent>
                  <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full grid-cols-1 max-md:p-8 max-md:gap-4">
                    <RaidStudentPrice />
                    <RaidExternalPrice />
                    <TShirtPrice />
                    {/* <PaymentLink /> */}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="contact">
                <AccordionTrigger>Contact</AccordionTrigger>
                <AccordionContent>
                  <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full grid-cols-1 max-md:p-8 max-md:gap-4">
                    <ContactMail />
                    <EmergencyPerson />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="files">
                <AccordionTrigger>Fichiers</AccordionTrigger>
                <AccordionContent>
                  <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full grid-cols-1 max-md:p-8 max-md:gap-4">
                    {information && <RaidRules information={information} />}
                    {information && (
                      <RaidInformationDocument information={information} />
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default InformationPage;
