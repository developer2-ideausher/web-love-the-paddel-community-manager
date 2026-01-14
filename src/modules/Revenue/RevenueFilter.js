import DatePicker from "@/components/DatePicker";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const FilterSection = ({ filters, setFilters, onApply }) => {
    const [openDropdown, setOpenDropdown] = useState(null);

    const { subscriberModel, validityPeriod, startDate, endDate } = filters;

    const toggleDropdown = (section) => {
        setOpenDropdown(openDropdown === section ? null : section);
    };
const isAnyFilterSelected = subscriberModel || validityPeriod || startDate || endDate;
 
    return (
        <div className="bg-white mb-5 space-y-4">
            {/* Subscription Plan */}
            <div className="border rounded-xl">
                <button
                    onClick={() => toggleDropdown("plan")}
                    className="w-full flex justify-between items-center px-4 py-3 text-left"
                >
                    <span className="font-medium">
                        Subscription Plan {validityPeriod && <span className="text-gray-500">({validityPeriod})</span>}
                    </span>
                    <span>{openDropdown === "plan" ? <ChevronUp /> : <ChevronDown />}</span>
                </button>
                {openDropdown === "plan" && (
                    <div className="px-4 pb-3 flex gap-2">
                        {["30 days", "365 days"].map((plan) => {
                            const isSelected = (validityPeriod || "").toLowerCase() === plan.toLowerCase();
                            return (
                                <button
                                    key={plan}
                                    onClick={() => setFilters((prev) => ({ ...prev, validityPeriod: plan }))}
                                    className={`border rounded-full px-3 py-1 text-sm ${isSelected ? "bg-black text-white" : "text-black"
                                        }`}
                                >
                                    {plan === "30 days" ? "Monthly" : "Yearly"}
                                </button>
                            );
                        })}

                    </div>
                )}
            </div>

            {/* Subscriber Type */}
            <div className="border rounded-xl">
                <button
                    onClick={() => toggleDropdown("subscriber")}
                    className="w-full flex justify-between items-center px-4 py-3 text-left"
                >
                    <span className="font-medium">
                        Subscriber Type {subscriberModel && <span className="text-gray-500">({subscriberModel})</span>}
                    </span>
                    <span>{openDropdown === "subscriber" ? <ChevronUp /> : <ChevronDown />}</span>
                </button>
                {openDropdown === "subscriber" && (
                    <div className="px-4 pb-3 flex flex-wrap gap-2">
                        {["ClubManager", "PrivateCoach", "PrivateProfessional"].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilters((prev) => ({ ...prev, subscriberModel: type }))}
                                className={`border rounded-full px-3 py-1 text-sm ${subscriberModel === type ? "bg-black text-white" : "text-black"
                                    }`}
                            >
                                {type.replace(/([A-Z])/g, " $1").trim()}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Date Range */}
            <div className="border rounded-xl">
                <button
                    onClick={() => toggleDropdown("date")}
                    className="w-full flex justify-between items-center px-4 py-3 text-left"
                >
                    <span className="font-medium">
                        Date Range{" "}
                        {startDate && endDate && (
                            <span className="text-sm text-gray-500">
                                ({startDate.toLocaleDateString()} - {endDate.toLocaleDateString()})
                            </span>
                        )}
                    </span>
                    <span>{openDropdown === "date" ? <ChevronUp /> : <ChevronDown />}</span>
                </button>
                {openDropdown === "date" && (
                    <div className="px-2 pb-4 flex gap-2">
                        <DatePicker
                            value={startDate}
                            onChange={(date) => setFilters((prev) => ({ ...prev, startDate: date }))}
                            className="border px-2 py-2 rounded-md text-sm w-full"
                        />

                        <DatePicker
                            value={endDate}
                            onChange={(date) => setFilters((prev) => ({ ...prev, endDate: date }))}
                            className="border px-2 py-2 rounded-md text-sm w-full"
                        />

                    </div>
                )}
            </div>

            <button
                onClick={onApply}
                className="w-full bg-black text-white py-2 rounded-md text-sm"  disabled={!isAnyFilterSelected} 
            >
                Apply Filters
            </button>
        </div>
    );
};

export default FilterSection;
