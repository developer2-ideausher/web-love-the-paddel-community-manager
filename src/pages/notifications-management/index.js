import NotificationsTable from "@/components/notificationManagement/NotificationsTable";
import Layout from "@/layout/Layout";
import React from "react";

const index = () => {
  return (
    <Layout title="Notifications Management">
      <NotificationsTable />
    </Layout>
  );
};


export default index;