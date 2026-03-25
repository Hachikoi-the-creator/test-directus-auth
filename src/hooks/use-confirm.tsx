import { Button } from "@/components/ui/button";
import { Dialog, DialogDescription, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

type ConfirmOptions = {
  title: string;
  description: string;
};

export const useConfirm = ({ title, description }: ConfirmOptions): [() => JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    promise?.resolve(false);
    setPromise(null);
  };
  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };
  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };
  const ConfrimationDialog = () => (
    <Dialog open={!!promise} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <DialogDescription>{description}</DialogDescription>
        <DialogFooter className="pt-2">
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfrimationDialog, confirm];
};
