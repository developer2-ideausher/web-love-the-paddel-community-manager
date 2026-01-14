import { useState, useEffect } from "react";
import FilterSection from "./RevenueFilter";
import { CircleX, ListFilter } from "lucide-react";


const FiltersWithToggle = ({ onApplyFilters, onClearFilters, filterApplied }) => {

  const [showFilters, setShowFilters] = useState(false);

  const [filterValues, setFilterValues] = useState({
    subscriberModel: "",
    validityPeriod: "",
    startDate: null,
    endDate: null,
  });

  const [appliedFilters, setAppliedFilters] = useState({});

  const handleApply = () => {
    const filters = {};
    if (filterValues.subscriberModel) filters.subscriberModel = filterValues.subscriberModel;
    if (filterValues.validityPeriod) filters.validityPeriod = filterValues.validityPeriod;
    if (filterValues.startDate) filters.startDate = filterValues.startDate.toISOString().split("T")[0];
    if (filterValues.endDate) filters.endDate = filterValues.endDate.toISOString().split("T")[0];
    if (filterValues.startDate) filters.year = filterValues.startDate.getFullYear().toString();

    onApplyFilters(filters);
    setShowFilters(false);
  };

  const isAnyFilterSelected = Object.values(filterValues).some(val => val);

  return (
    <div className="relative">
      <div className="flex justify-end gap-2 mb-4">
        {filterApplied && (
          <button
            onClick={onClearFilters}
            className="px-4  rounded-full border-2 text-sm text-[#cc1728] border-[#cc1728]  hover:text-red-500 transition items-center mt-5 flex gap-2 text-nowrap"
          >   <CircleX color="#cc1728" />
            Remove Filters
          </button>
        )}

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-5 py-3 text-sm text-gray-700  mt-4 transition "
        >
          <ListFilter />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="absolute z-10 bg-white border border-gray-200 shadow-lg rounded-lg p-4 w-96 top-[85] left-[-233px]">
          <FilterSection
            filters={filterValues}
            setFilters={setFilterValues}
            onApply={handleApply}
          />

        </div>
      )}
    </div>
  );
};
export default FiltersWithToggle
