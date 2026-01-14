import { useEffect, useState } from "react";
import { ChevronDown, CircleX } from "lucide-react";
import { getVendorCategories } from "@/services/clubServices";
import Loader from "../ui/Loader";

const CategoryDropdown = ({ selectedCategories, setSelectedCategories, onApply, filterApplied, onClear }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen && categories.length === 0) {
            fetchCategories();
        }
    }, [isOpen]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await getVendorCategories();
            if (res?.data) {
                setCategories(res.data || []);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
        setLoading(false);
    };

    const handleCheckboxChange = (categoryId) => {
        setSelectedCategories((prev) => {
            const newCategories = prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId];
            return newCategories;
        });
    };

    const handleApply = () => {
        setIsOpen(false);
        onApply(selectedCategories);
    };

    return (
        <>
            <Loader loading={loading} />

            {/* {filterApplied && (
                <button
                    className="border-2 border-primary  text-primary rounded-md h-11 bg-white  px-4 py-2  flex gap-2 items-center"
                    onClick={onClear}
                > <CircleX />
                    Clear Filter
                </button>
            )} */}

            <div className="relative">
                <button
                    className="bg-white border px-4 py-3 rounded-md flex gap-2 items-center"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <img src="/icons/fast-food.png" alt="Category" />
                    <span className="text-black-1 text-sm font-medium">Select Category</span>
                    <ChevronDown color="#5D5D5D" />
                </button>

                {isOpen && (
                    <div className="absolute mt-2 w-64 bg-white border shadow-lg rounded-md p-2 z-10">
                        <div className="max-h-60 overflow-y-auto">
                            {categories.map((category) => (
                                <label
                                    key={category._id}
                                    className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category._id)}
                                        onChange={() => handleCheckboxChange(category._id)}
                                    />
                                    <span className="text-sm">{category.name}</span>
                                </label>
                            ))}
                        </div>

                        <div className="mt-2">
                            <button
                                className="w-full bg-red-600 text-white py-2 rounded-md"
                                onClick={handleApply}
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CategoryDropdown;
