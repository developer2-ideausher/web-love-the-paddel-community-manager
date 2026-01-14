import React, { useEffect, useState } from "react";
import Layout from "@/layout/Layout";
import Loader from "@/components/ui/Loader";
import MetricsCard from "@/components/RevenueManagement/MetricsCard";
import dynamic from "next/dynamic";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/Paignation";
import { getRevenueData } from "@/services/revenue.Services";
import Button from "@/components/Button";
import FiltersWithToggle from "@/modules/Revenue/FilterWithToggle";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
const Index = () => {
  const [filters, setFilters] = useState({});
  const [filterApplied, setFilterApplied] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState({});
  const [subscriptionData, setSubscriptionData] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  useEffect(() => {
    fetchRevenueData(filters);
  }, [filters, pagination.page, pagination.limit]);

  const fetchRevenueData = async (customFilters = {}) => {
    setLoading(true);
    const payload = {
      page: pagination.page,
      limit: pagination.limit,
      ...customFilters,
    };
    const res = await getRevenueData(payload);
    if (res?.status) {
      setRevenueData(res?.data);
      setSubscriptionData(res?.data?.ledger?.results);
    }
    setLoading(false);
  };

  const monthlyRevenueSeries = [
    {
      name: "Monthly Revenue",
      data: revenueData?.monthlyRevenueTrend?.map((item) => item.revenue) || [],
    },
  ];

  const yearlyRevenueSeries = [
    {
      name: "Yearly Revenue",
      data: revenueData?.yearlyRevenueTrend?.map((item) => item.revenue) || [],
    },
  ];

  const monthlyChartOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
      selection: { enabled: false },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories:
        revenueData?.monthlyRevenueTrend?.map((item) => item.month) || [],
      title: { text: "Months" },
    },
    yaxis: { title: { text: "Revenue (AED)" } },
    colors: ["#008FFB"],
    tooltip: { shared: true, intersect: false },
    legend: { position: "top", horizontalAlign: "right" },
  };

  const yearlyChartOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
      selection: { enabled: false },
      events: {
        mounted: (chartContext) => {
          chartContext.el.querySelector(".apexcharts-canvas").style.cursor =
            "default";
        },
      },
    },

    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories:
        revenueData?.yearlyRevenueTrend?.map((item) => item.year.toString()) ||
        [],
      title: { text: "Years" },
    },
    yaxis: { title: { text: "Revenue (AED)" } },
    colors: ["#008FFB"],
    tooltip: { shared: true, intersect: false },
    legend: { position: "top", horizontalAlign: "right" },
    markers: {
      size: 5,
      strokeWidth: 2,
      hover: { sizeOffset: 3 },
    },
  };

  const handleApplyFilters = (appliedFilters) => {
    setFilters(appliedFilters);
    const hasAnyFilters = Object.values(appliedFilters).some((val) => val);
    setFilterApplied(hasAnyFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setFilterApplied(false);
  };

  const handleExport = () => {
    if (typeof window === "undefined" || !subscriptionData.length) return;

    const fileName = window.prompt(
      "Enter a name for the exported file:",
      "Subscription Revenue"
    );
    if (!fileName) return;

    const headers = [
      "Subscriber Name",
      "Subscriber Type",
      "Subscription Plan",
      "Validity Period",
      "Revenue Earned",
    ];

    const rows = subscriptionData.map((item) => [
      item?.subscriber?.firstName && item?.subscriber?.lastName
        ? `${item.subscriber.firstName} ${item.subscriber.lastName}`
        : "N/A",
      item?.subscriberModel || "N/A",
      item?.subscriptionPlan?.planName || "N/A",
      item?.validityPeriod || "N/A",
      item?.revenueEarned || "N/A",
    ]);

    const csvContent = [headers, ...rows]
      ?.map((row) =>
        row?.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout title={"Revenue Management"}>
      {loading ? (
        <Loader loading={loading} />
      ) : (
        <>
          <MetricsCard data={revenueData} />
          <div className="grid  md:grid-cols-2 lg:grid-cols-2 gap-5">
            <div className="p-4 bg-white shadow rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-semibold text-black-8">
                  Monthly Revenue Trend
                </h3>
                <div className="relative inline-block w-[146px]">
                  <select
                    className="appearance-none border text-sm font-normal text-gray-3 border-gray-2 rounded-xl px-4 py-3 outline-none w-full pr-10"
                    value={selectedYear}
                    onChange={(e) => {
                      const year = e.target.value;
                      setSelectedYear(year);
                      setFilters((prev) => ({
                        ...prev,
                        year,
                      }));
                    }}
                  >
                    {revenueData?.yearsList?.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>
              <ReactApexChart
                options={monthlyChartOptions}
                series={monthlyRevenueSeries}
                type="line"
                height={300}
              />
            </div>

            <div className="p-4 bg-white shadow rounded-2xl">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-base font-semibold text-black-8">
                  Yearly Revenue Trend
                </h3>
                {/* <div className="relative inline-block w-[146px]">
                                    <select
                                        className="appearance-none border text-sm font-normal text-gray-3 border-gray-2 rounded-xl px-4 py-3 outline-none w-full pr-10"
                                        // value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                    >
                                        <option >Select Year</option>
                                        {revenueData?.yearsList.map((year) =>
                                            <option value="currentYear">{year}</option>
                                        )}
                                    </select>
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                        <svg
                                            className="w-5 h-5 text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            ></path>
                                        </svg>
                                    </div>
                                </div> */}
              </div>
              <ReactApexChart
                options={yearlyChartOptions}
                series={yearlyRevenueSeries}
                type="line"
                height={300}
              />
            </div>
          </div>

          <div className="pt-6 ">
            <div className="flex justify-between mb-5 items-center">
              <h2 className="text-[#141414] font-semibold text-xl">
                {" "}
                Subscription Revenue
              </h2>
              <div className="flex items-center gap-4">
                <div>
                  <FiltersWithToggle
                    onApplyFilters={handleApplyFilters}
                    onClearFilters={handleClearFilters}
                    filterApplied={filterApplied}
                  />
                </div>
                <Button className={"py-3"} onClick={handleExport}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.16699 9.16699V4.16699H10.8337V9.16699H15.8337V10.8337H10.8337V15.8337H9.16699V10.8337H4.16699V9.16699H9.16699Z"
                      fill="white"
                    />
                  </svg>
                  Export
                </Button>
              </div>
            </div>
            <Table className="min-w-full overflow-x-auto">
              <TableHeader className="border-t-1">
                <TableRow className="bg-light-blue rounded-lg  ">
                  <TableHead className="text-white font-normal text-sm text-left">
                    Subscriber Name
                  </TableHead>

                  <TableHead className="text-white font-normal text-sm text-left flex items-center gap-1">
                    Subscriber Type
                  </TableHead>

                  <TableHead className="text-white font-normal text-sm text-left">
                    Subscription Plan
                  </TableHead>
                  <TableHead className="text-white font-normal text-sm text-left">
                    Validity Period
                  </TableHead>
                  <TableHead className="text-white font-normal text-sm text-left">
                    Revenue Earned
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptionData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-4 text-gray-500"
                    >
                      No Data Found
                    </TableCell>
                  </TableRow>
                ) : (
                  subscriptionData?.map((item, index) => (
                    <TableRow
                      key={index}
                      className="bg-white hover:bg-white cursor-pointer"
                    >
                      <TableCell>
                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                          {item?.subscriber?.firstName &&
                          item?.subscriber?.lastName
                            ? `${item.subscriber.firstName} ${item.subscriber.lastName}`
                            : "N/A"}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                          {" "}
                          {item?.subscriberModel || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                          {item?.subscriptionPlan?.planName || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                          {item?.validityPeriod || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                          {item?.revenueEarned || "N/A"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <Pagination pagination={pagination} setPagination={setPagination} />
          </div>
        </>
      )}
    </Layout>
  );
};
export default Index;
