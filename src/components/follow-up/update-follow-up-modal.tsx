import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFollowUpStore } from "@/context/follow-up-context";
import { type EventRules } from "@/types/api-collection";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { getEventRules } from "@/DAL/event-rules";
import { updateFollowUp } from "@/DAL/follow-ups";

type Props = {
  followUpData: EventRules;
  setIsModalOpen: (value: boolean) => void;
  isModalOpen: boolean;
  fieldToEdit: "minutes" | "name";
};

const formSchema = z.object({
  minutes: z.string(),
  instructions: z.string(),
});

export default function UpdateFollowUpModal({
  followUpData,
  fieldToEdit,
  isModalOpen,
  setIsModalOpen,
}: Props) {
  const [isPending, setIsPending] = useState(false);
  const { setFollowUps } = useFollowUpStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      minutes: followUpData.offset_minutes?.toString() ?? "",
      instructions: followUpData.name ?? "",
    },
  });

  const handleUpdate = async ({
    id,
    instructions,
    minutes,
  }: {
    id: string;
    instructions: string;
    minutes: number;
  }) => {
    try {
      setIsPending(true);

      const updatedFollowUp = await updateFollowUp({
        id: followUpData.id,
        name: instructions,
        offset_minutes: minutes,
      } );

      // Fetch updated follow ups
      const updatedFollowUps = await getEventRules();
      setFollowUps(updatedFollowUps);

      setIsModalOpen(false);
      toast.success("Follow up updated");
    } catch (error: any) {
      toast.error(error.message, { duration: 5000 });
    } finally {
      setIsPending(false);
    }
  };

  const onSubmit = useCallback(
    (data: z.infer<typeof formSchema>) => {
      const updated_data = {
        id: followUpData.id,
        minutes: Number(data.minutes),
        instructions: data.instructions,
      };
      handleUpdate(updated_data);
    },
    [followUpData]
  );

  return (
    <Dialog
      onOpenChange={(val) => {
        if (!val) form.reset();
        setIsModalOpen(val);
      }}
      open={isModalOpen}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Update Follow Up Number {followUpData.offset_minutes}
          </DialogTitle>
          <DialogDescription>Update follow up details</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mx-auto max-w-3xl space-y-4 py-3"
            >
              <FormField
                control={form.control}
                name="minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minutes</FormLabel>
                    <FormControl>
                      <Input
                        autoFocus={fieldToEdit === "minutes"}
                        placeholder="After how many minutes do you want to send a message with this prompt?"
                        type="number"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                      <Input
                        autoFocus={fieldToEdit === "name"}
                        placeholder="What prompt do you want to use?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isPending}>
                  Save
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
