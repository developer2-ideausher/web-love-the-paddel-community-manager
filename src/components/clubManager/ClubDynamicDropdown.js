"use client";
import { getClubList } from "@/services/clubServices";
import { useState, useEffect } from "react";
import Button from "../Button";
import { BeatLoader } from "react-spinners";

export default function DynamicDropdown({
    placeholder,
    value = [],
    callback,
    maxSelection = 5,
}) {
    const [options, setOptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [loadingClubs, setLoadingClubs] = useState(false);
    const loadOptions = async (reset = false) => {
       setLoadingClubs(true);
        try {
            const res = await getClubList({ search: searchTerm, page, limit: 5 });
            if (res?.data?.results) {
                const { results, totalPages } = res.data;
                setTotalPages(totalPages); 
                if (reset) {
                    setOptions(results || []);
                } else {
                    setOptions((prev) => [...prev, ...results]);
                }
            }
        } catch (err) {
            console.error("Dropdown fetch error:", err);
        }
       setLoadingClubs(false);
    };

    useEffect(() => {
        if (open) {
            loadOptions(page === 1);
        }
    }, [open, searchTerm, page]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); 
    };

    const handleSelect = (item) => {
        let updated = [...value];
        const exists = updated.find((club) => club._id === item._id);

        if (exists) {
            updated = updated.filter((club) => club._id !== item._id);
        } else {
            if (updated.length >= maxSelection) return;
            updated.push(item);
        }

        callback(updated);
    };

    const removeClub = (clubId) => {
        const updated = value.filter((club) => club._id !== clubId);
        callback(updated);
    };

    return (
        <div className="relative w-full">
            <div
                onClick={() => setOpen((prev) => !prev)}
                className="border rounded p-2 cursor-pointer bg-white flex justify-between items-center"
            >
                <span>
                    {value.length > 0 ? `${value.length} club(s) selected` : placeholder}
                </span>

                <svg
                    className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {open && (
                <div className="absolute z-10 bg-white border rounded w-full mt-1 max-h-64 overflow-y-auto shadow-lg">
                    <div className="p-2 border-b">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full p-1 border rounded pr-7"
                            />

                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>

                    { loadingClubs ? (
            <div className="flex justify-center py-8">
              <BeatLoader size={12} color="#000" />
            </div>
          ) :
                    options && options.length > 0 ? (
                        options.map((item) => {
                            const selected = value.some((club) => club._id === item._id);
                            return (
                                <div
                                    key={item._id}
                                    onClick={() => handleSelect(item)}
                                    className={`p-2 cursor-pointer flex items-center 
                    ${selected ? "text-primary" : "hover:bg-gray-100"}`}
                                >
                                    <span
                                        className={`w-4 h-4 mr-2 rounded-full border-2 flex items-center justify-center
                     ${selected ? "border-primary bg-primary" : "border-gray-400"}`}
                                    >
                                        {selected && (
                                            <span className="w-2 h-2 bg-white rounded-full"></span>
                                        )}
                                    </span>

                                    <span
                                        className={"text-primary font-medium"}
                                    >
                                        {item.clubName}
                                    </span>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-2 text-gray-500">No clubs found</div>
                    )}

                    {page < totalPages && (
                        <div className="p-2 text-center w-40 mx-auto mb-3">
                            <Button
                                onClick={() => setPage((prev) => prev + 1)}
                                className="px-3 py-1"
                                disabled={loading}
                            >
                                {loading ? "Loading..." : "Load More"}
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
                {value.map((club) => (
                    <span
                        key={club._id}
                        className="bg-light-blue text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                        {club.clubName}
                        <button
                            onClick={() => removeClub(club._id)}
                            className="text-white hover:text-red-700"
                        >
                            ✕
                        </button>
                    </span>
                ))}
            </div>

            {value.length >= maxSelection && (
                <p className="text-red-500 text-sm mt-1">
                    You can select up to {maxSelection} clubs only
                </p>
            )}
        </div>
    );
}
