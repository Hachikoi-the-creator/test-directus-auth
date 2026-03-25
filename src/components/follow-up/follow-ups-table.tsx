import { useFollowUpStore } from "@/context/follow-up-context";
import { type EventRules, type EventTypes } from "@/types/api-collection";
import { Edit, Trash2 } from "lucide-react";
import { Anchor } from "../ui/anchor";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type Props = {
  handleRowCellClick: (followUp: EventRules) => void;
  handleDelete: (followUp: EventRules) => void;
};

export default function FollowUpsTable({
  handleRowCellClick,
  handleDelete,
}: Props) {
  const { followUps } = useFollowUpStore();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Event Type</TableHead>
          <TableHead>Offset Minutes</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      {/* content of the table */}
      <TableBody>
        {followUps.map((followUp: EventRules) => (
          <TableRow key={followUp.id}>
            <TableCell
              className="font-medium cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleRowCellClick(followUp)}
            >
              {followUp.name}
            </TableCell>
            <TableCell
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleRowCellClick(followUp)}
            >
              <Badge variant="secondary" className="text-xs">
                {(followUp.event_type as EventTypes).name}
              </Badge>
            </TableCell>
            <TableCell
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleRowCellClick(followUp)}
            >
              {followUp.offset_minutes} min
            </TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Anchor
                  href={`/follow-ups/${followUp.id}/edit`}
                  variant="outline"
                  size="sm"
                  className="px-3 py-2 rounded-md"
                >
                  <Edit className="h-4 w-4" />
                </Anchor>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(followUp)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
