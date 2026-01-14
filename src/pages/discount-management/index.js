import DiscountTable from "@/components/Dashboard";
import Layout from "@/layout/Layout";
import React from "react";

const index = () => {
  return (
    <Layout title="Discount Management">
      <DiscountTable />
    </Layout>
  );
};

export default index;
