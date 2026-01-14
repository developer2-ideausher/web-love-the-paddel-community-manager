import CreateSubscription from "@/components/SubscriptionsManagement/CreateSubscription";
import Layout from "@/layout/Layout";
import React from "react";


const index = () => {
  return (
    <Layout title="Subscription Management">
      <CreateSubscription />
    </Layout>
  );
};


export default index;
