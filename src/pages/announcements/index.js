import AnnounementTable from "@/components/announcements/AnnouncementTable";
import NotificationsTable from "@/components/notificationManagement/NotificationsTable";
import Layout from "@/layout/Layout";
import React from "react";

const index = () => {
  return (
    <Layout title="Announcements">
      <AnnounementTable />
    </Layout>
  );
};

export default index;
