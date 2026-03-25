"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFollowUpStore } from "@/context/follow-up-context";
import { getEventRules } from "@/DAL/event-rules";
import { createFollowUp, deleteFollowUp, updateFollowUp } from "@/DAL/follow-ups";
import { type EventRules } from "@/types/api-collection";
import { createItem } from "@directus/sdk";
import { Edit, Plus, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type FollowUpListProps = {
  followUps: EventRules[];
  token: string;
};

export default function FollowUpList({ followUps, token }: FollowUpListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", offset_minutes: 0 });
  const [createForm, setCreateForm] = useState({ name: "", offset_minutes: 5 });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const { setFollowUps } = useFollowUpStore();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleEdit = (item: EventRules) => {
    setEditingId(item.id);
    setEditForm({
      name: item.name || "",
      offset_minutes: item.offset_minutes || 0,
    });
  };

  const handleSave = async (id: string) => {
    try {
      setIsPending(true);
      setLoading(id);

      await updateFollowUp(
        { id, name: editForm.name, offset_minutes: editForm.offset_minutes }
      );

      toast.success("Follow up updated");
      setEditingId(null);
    } catch (error: any) {
      console.error("Failed to update item:", error);
      toast.error(error.message || "Failed to update follow-up");
    } finally {
      setLoading(null);
      setIsPending(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ name: "", offset_minutes: 0 });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        setIsPending(true);
        setLoading(id);

        await deleteFollowUp(id);

        toast.success("Follow up deleted");
      } catch (error: any) {
        console.error("Failed to delete item:", error);
        toast.error(error.message || "Failed to delete follow-up");
      } finally {
        setLoading(null);
        setIsPending(false);
      }
    }
  };

  const handleCreate = async () => {
    try {
      setIsPending(true);
      setLoading("create");
      await createFollowUp({
        name: createForm.name,
        offset_minutes: createForm.offset_minutes,
        sub_channel: [],
        custom_params: {},
      });

      // Fetch updated follow ups
      const updatedFollowUps = await getEventRules();
      setFollowUps(updatedFollowUps);

      toast.success("Follow up created");
      setCreateForm({ name: "", offset_minutes: 5 });
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      console.error("Failed to create item:", error);
      toast.error(error.message || "Failed to create follow-up");
    } finally {
      setLoading(null);
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="mb-8 text-3xl font-bold ">Follow Ups</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Follow Up
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Follow Up</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="create-name">Name</Label>
                <Input
                  id="create-name"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter follow-up name..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="create-minutes">Offset Minutes</Label>
                <Input
                  id="create-minutes"
                  type="number"
                  value={createForm.offset_minutes}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      offset_minutes: Number.parseInt(e.target.value) || 0,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={
                    loading === "create" || isPending || !createForm.name.trim()
                  }
                >
                  {loading === "create" ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {followUps.map((item) => (
          <Card key={item.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {item.name || "Unnamed Rule"}
                </CardTitle>
                <div className="flex space-x-1">
                  {editingId === item.id ? (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSave(item.id)}
                        disabled={loading === item.id || isPending}
                      >
                        <Save className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancel}
                        disabled={loading === item.id || isPending}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(item)}
                        disabled={loading === item.id || isPending}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(item.id)}
                        disabled={loading === item.id || isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <Badge variant="secondary" className="w-full">
                {item.id.slice(0, 8)}...
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Name
                </Label>
                {editingId === item.id ? (
                  <Input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="mt-1"
                    placeholder="Enter follow-up name"
                  />
                ) : (
                  <p className="mt-1 text-sm">{item.name || "Unnamed Rule"}</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Offset Minutes
                </Label>
                {editingId === item.id ? (
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
                  />
                ) : (
                  <p className="mt-1 text-sm font-medium">
                    {item.offset_minutes} minutes
                  </p>
                )}
              </div>

              <div className="pt-2 border-t space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Created:</span>
                  <span>{formatDate(item.date_created || "")}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Updated:</span>
                  <span>{formatDate(item.date_updated || "")}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>ID:</span>
                  <span
                    className="font-mono truncate max-w-[120px]"
                    title={item.id}
                  >
                    {item.id.slice(0, 8)}...
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {followUps.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No items found. Create your first item to get started.
          </p>
        </div>
      )}
    </div>
  );
}
