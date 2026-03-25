import { useFollowUpStore } from "@/context/follow-up-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { Button } from "../ui/button";
import { type formSchema } from "./add-follow-up-modal";
import { updateFollowUp } from "@/DAL/follow-ups";
import { getEventRules } from "@/DAL/event-rules";

export default function TemplateSubmitBtn({
  ruleId,
  currentRule,
}: {
  ruleId: string;
  currentRule: any;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const { setFollowUps } = useFollowUpStore();
  const router = useRouter();

  // Access form data
  const form = useFormContext<z.infer<typeof formSchema>>();

  const saveChanges = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true);

      // Original save logic
      const body: any = {
        name: data.name,
        event_type: data.event_type,
        offset_minutes: Number(data.offset_minutes),
      };

      const currentSubId = (
        currentRule?.sub_channel?.[0]?.sub_channel_id as any
      )?.id;

      if (!currentSubId || currentSubId !== data.sub_channel) {
        body.sub_channel = {
          delete: "*",
          create: [
            {
              event_rules_id: ruleId,
              sub_channel: "chawoot_whatsapp",
              sub_channel_id: { id: data.sub_channel },
            },
          ],
          update: [],
        };
      }

      const updatedFollowUp = await updateFollowUp({
        id: ruleId,
        name: data.name,
        offset_minutes: Number(data.offset_minutes),
      } );

      const updatedFollowUps = await getEventRules();
      setFollowUps(updatedFollowUps);
      toast.success("Follow up updated");
      router.refresh();
      return updatedFollowUp;
    } catch (error: any) {
      toast.error(error.message, { duration: 5000 });
    } finally {
      setIsSaving(false);
    }
    return null;
  };

  const handleSave = () => {
    // Trigger form validation and submission
    form.handleSubmit((data) => {
      saveChanges(data);
    })();
  };

  return (
    <Button type="button" onClick={handleSave} disabled={isSaving}>
      Save Changes
    </Button>
  );
}
