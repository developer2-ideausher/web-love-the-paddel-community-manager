import UserTable from "@/components/UsersPage/UserTable";
import Layout from "@/layout/Layout";
import React from "react";

const index = () => {
  return (
    <Layout title="User Management">
      <UserTable  />
    </Layout>
  );
};
 

export default index;
