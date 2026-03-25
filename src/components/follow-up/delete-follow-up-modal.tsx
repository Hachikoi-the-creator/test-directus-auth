"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFollowUpStore } from "@/context/follow-up-context";
import { type EventRules } from "@/types/api-collection";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { deleteFollowUp, getFollowUps } from "@/DAL/follow-ups";

type Props = {
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  followUpToDelete: EventRules;
};

export default function DeleteFollowUpModal({
  isModalOpen,
  setIsModalOpen,
  followUpToDelete,
}: Props) {
  const [isPending, setIsPending] = useState(false);
  const { setFollowUps } = useFollowUpStore();

  const handleDelete = async () => {
    try {
      setIsPending(true);

      await deleteFollowUp(followUpToDelete.id);

      // Fetch updated follow ups
      const updatedFollowUps = await getFollowUps();
      setFollowUps(updatedFollowUps);

      setIsModalOpen(false);
      toast.success("Follow up removed");
    } catch (error: any) {
      toast.error(error.message, { duration: 5000 });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog
      onOpenChange={(val) => {
        setIsModalOpen(val);
      }}
      open={isModalOpen}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="py-3 leading-6">
            Are you sure you want to delete? {`"${followUpToDelete.name}"`}
          </DialogTitle>
          <DialogDescription>
            Once deleted cannot be recovered
          </DialogDescription>
        </DialogHeader>
        <div className="space-x-4">
          <Button
            variant={"outline"}
            type="button"
            className=""
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant={"destructive"}
            type="submit"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
