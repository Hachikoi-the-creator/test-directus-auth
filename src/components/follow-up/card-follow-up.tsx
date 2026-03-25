import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFollowUpStore } from "@/context/follow-up-context";
import { type EventRules } from "@/types/api-collection";
import { type WaTemplate } from "@/types/whatsapp";
import { Edit, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import DetailsModal from "./details-modal";
import { updateEventRule } from "@/DAL/event-rules";
import { getFollowUps } from "@/DAL/follow-ups";

type Props = {
  followUp: EventRules;
  handleDelete: (followUp: EventRules) => void;
  token: string;
  currentTemplate: WaTemplate | null;
};

export default function CardFollowUp({
  followUp: followUpd,
  handleDelete,
  token,
  currentTemplate,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", offset_minutes: 0 });
  const [loading, setLoading] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const { setFollowUps } = useFollowUpStore();

  const handleUpdate = async () => {
    try {
      setIsPending(true);
      setLoading(followUpd.id);

      const updatedEventRule = await updateEventRule(followUpd.id, {
        name: editForm.name,
        offset_minutes: editForm.offset_minutes,
      });
      
      if (!updatedEventRule) {
        throw new Error("Failed to update event rule");
      }

      // Fetch updated follow ups
      const updatedFollowUps = await getFollowUps();
      setFollowUps(updatedFollowUps);

      toast.success("Follow up updated");
      setEditingId(null);
    } catch (error: any) {
      toast.error(error.message, { duration: 5000 });
      setEditingId(null);
    } finally {
      setLoading(null);
      setIsPending(false);
    }
  };

  const handleEdit = (e: React.MouseEvent, followUpd: EventRules) => {
    e.stopPropagation();
    setEditingId(followUpd.id);
    setEditForm({
      name: followUpd.name || "",
      offset_minutes: followUpd.offset_minutes || 0,
    });
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setEditForm({ name: "", offset_minutes: 0 });
  };

  const handleDeleteClick = (e: React.MouseEvent, followUp: EventRules) => {
    e.stopPropagation();
    handleDelete(followUp);
  };

  return (
    <>
      <Card
        key={followUpd.id}
        className="relative cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            {editingId === followUpd.id ? (
              <div className="flex-1 mr-2">
                <Input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Event rule name"
                  className="text-lg font-semibold"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ) : (
              <CardTitle className="text-lg">
                {followUpd.name || "Unnamed Rule"}
              </CardTitle>
            )}
            <div className="flex space-x-1">
              {editingId === followUpd.id ? (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdate();
                    }}
                    disabled={loading === followUpd.id || isPending}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={loading === followUpd.id}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleEdit(e, followUpd)}
                    disabled={loading === followUpd.id}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => handleDeleteClick(e, followUpd)}
                    disabled={loading === followUpd.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          <Badge className="w-full" variant="secondary">
            {followUpd.id}...
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground hover:cursor-pointer">
              Offset Minutes
            </Label>
            {editingId === followUpd.id ? (
              <Input
                type="number"
                value={editForm.offset_minutes}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    offset_minutes: Number.parseInt(e.target.value) || 0,
                  }))
                }
                className="mt-1"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <p className="mt-1 text-sm font-medium">
                {followUpd.offset_minutes} minutes
              </p>
            )}
          </div>

          {/*  */}
        </CardContent>
      </Card>

      <DetailsModal
        currentTemplate={currentTemplate}
        followUp={followUpd}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        token={token}
      />
    </>
  );
}
