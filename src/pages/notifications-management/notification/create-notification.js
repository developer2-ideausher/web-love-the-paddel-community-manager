
import CreateNotification from "@/components/notificationManagement/CreateNotification";
import Layout from "@/layout/Layout";
import React from "react";


const index = () => {
  return (
    <Layout title= "Notification Management">
      <CreateNotification  />
    </Layout>
  );
};
 

export default index;