import { StyledFormField } from "../../custom/StyledFormField";
import { Label } from "../../ui/label";
import { UseFormReturn } from "react-hook-form";
import { CardTemplate } from "./CardTemplate";
import { Checkbox } from "../../ui/checkbox";
import { RegisteringFormValues } from "@/src/forms/registering";

interface ParticipationCardProps {
  form: UseFormReturn<RegisteringFormValues>;
}

export const ParticipationCard = ({ form }: ParticipationCardProps) => {
  return (
    <CardTemplate>
      <h2 className="text-xl font-semibold">Ta participation au Challenge</h2>
      <div className="w-full grid gap-8 lg:gap-12 lg:w-2/3">
        <StyledFormField
          form={form}
          id="is_athlete"
          input={(field) => (
            <div className="flex items-center space-x-2 ">
              <Checkbox
                id="is_athlete"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="is_athlete">Sportif</Label>
            </div>
          )}
        />

        <StyledFormField
          form={form}
          id="is_pompom"
          input={(field) => (
            <div className="flex items-center space-x-2 ">
              <Checkbox
                id="is_pompom"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="is_pompom">Cheerleader</Label>
            </div>
          )}
        />

        <StyledFormField
          form={form}
          id="is_fanfare"
          input={(field) => (
            <div className="flex items-center space-x-2  ">
              <Checkbox
                id="is_fanfare"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="is_fanfare">Fanfaron</Label>
            </div>
          )}
        />

        <StyledFormField
          form={form}
          id="is_cameraman"
          input={(field) => (
            <div className="flex items-center space-x-2  ">
              <Checkbox
                id="is_cameraman"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="is_cameraman">Caméraman</Label>
            </div>
          )}
        />
      </div>
    </CardTemplate>
  );
};
