import CreateCouponForm from "@/components/clubManager/CouponCreate";
import Layout from "@/layout/Layout";
import React from "react";

function CreateCoupon() {
  return (
    <Layout title="Vendors">
    <div className="bg-[#F7F8F8]">
      <CreateCouponForm />
    </div>
    </Layout>
  );
}

export default CreateCoupon;
