import SubscriptionTable from "@/components/SubscriptionsManagement/SubscriptionTable";
import Layout from "@/layout/Layout";
import React from "react";

const index = () => {
  return (
    <Layout title="Subscription Management">
      <SubscriptionTable />
    </Layout>
  );
};


export default index;
