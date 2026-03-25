import FollowUpEditClient from "@/components/follow-up/follow-up-edit-client";
import { requireDirectusAccessToken } from "@/lib/directus-auth";
import { notFound } from "next/navigation";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type PageProps = {
  params: { id: string };
};

export default async function FollowUpEditPage({ params }: PageProps) {
  const { id } = params;
  if (!UUID_RE.test(id)) {
    notFound();
  }

  return <FollowUpEditClient ruleId={id}/>;
}
