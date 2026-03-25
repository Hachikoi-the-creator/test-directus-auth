"use client";

import AddFollowUpModal from "@/components/follow-up/add-follow-up-modal";
import DeleteFollowUpModal from "@/components/follow-up/delete-follow-up-modal";
import DetailsModal from "@/components/follow-up/details-modal";
import FollowUpsTable from "@/components/follow-up/follow-ups-table";
import LoadingSkeleton from "@/components/follow-up/loading-skeleton";
import { useFollowUpStore } from "@/context/follow-up-context";
import { useMetaTemplatesStore } from "@/context/meta-templates-context";
import type { EventRules } from "@/types/api-collection";
import { getFollowUps } from "@/DAL/follow-ups";
import { useEffect, useRef, useState } from "react";

export default function FollowUpsPage() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<EventRules | null>(
    null
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedFollowUpForDetails, setSelectedFollowUpForDetails] =
    useState<EventRules | null>(null);
  

  const { getStoredMetaTemplates, metaTemplates } = useMetaTemplatesStore(
    (store) => store
  );
  const { isLoading, error, setFollowUps, setLoading, setError } =
    useFollowUpStore();

  const hasCalledEffect = useRef(false);
  const hasFetchedData = useRef(false);

  useEffect(() => {
    if (hasCalledEffect.current) return;
    hasCalledEffect.current = true;
    getFollowUps();
  }, []);

  // Effect to fetch data when token is available
  useEffect(() => {
    if (!hasFetchedData.current) {
      hasFetchedData.current = true;
      getFollowUps();
      getStoredMetaTemplates();
    }
  }, []);

  const handleDelete = (followUp: EventRules) => {
    setSelectedFollowUp(followUp);
    setIsDeleteModalOpen(true);
  };

  const handleRowCellClick = (followUp: EventRules) => {
    setSelectedFollowUpForDetails(followUp);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Follow Ups</h1>
          <p className="text-muted-foreground">
            Manage your follow up templates and configurations
          </p>
        </div>
        <AddFollowUpModal />
      </div>

      <FollowUpsTable
        handleRowCellClick={handleRowCellClick}
        handleDelete={handleDelete}
      />

      {/* Details Modal */}
      {selectedFollowUpForDetails && (
        <DetailsModal
          followUp={selectedFollowUpForDetails}
          currentTemplate={
            metaTemplates.filter(Boolean).find(
              (t) =>
                t.name ===
                // @ts-ignore
                selectedFollowUpForDetails.custom_params?.whatsapp_template
                  ?.template_name
            ) || null
          }
          isModalOpen={isDetailsModalOpen}
          setIsModalOpen={setIsDetailsModalOpen}
        />
      )}

      {/* Delete Modal */}
      {selectedFollowUp && (
        <DeleteFollowUpModal
          isModalOpen={isDeleteModalOpen}
          setIsModalOpen={setIsDeleteModalOpen}
          followUpToDelete={selectedFollowUp}
        />
      )}
    </div>
  );
}
