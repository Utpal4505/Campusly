"use client";

import CreatePostModal from "@/components/CreatePostModal";
import EditInterestsModal from "@/components/EditInterestsModal";
import ClaimHandleModal from "@/components/ClaimHandleModal";

export default function GlobalModals() {
  return (
    <>
      <CreatePostModal />
      <EditInterestsModal />
      <ClaimHandleModal />
    </>
  );
}
