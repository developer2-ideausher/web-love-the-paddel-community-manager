import PublishWeekClubs from '@/components/clubManager/PublishClub';
import Layout from '@/layout/Layout';
import React from 'react'

const pickWeekClub = () => {
  return (
    <Layout title="Club Manager Management">
      <PublishWeekClubs />
    </Layout>
  );
}

export default pickWeekClub
