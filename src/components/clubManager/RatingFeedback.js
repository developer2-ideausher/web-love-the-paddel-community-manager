import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";

import Loader from "../ui/Loader";
import Pagination from "../Paignation";


const RatingSummary = ({ ratings }) => {
  if (!ratings || ratings.length === 0) return null;

  const totalReviews = ratings.length;
  const totalRating = ratings.reduce((acc, curr) => acc + curr.starsGiven, 0);

  const averageRating = totalReviews ? (totalRating / totalReviews).toFixed(1) : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((r) => r.starsGiven === star).length

  }));

  return (
    <div className="p-6 w-2/3  mb-8">
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        <div className="flex flex-col items-center">
          <span className="text-4xl font-bold">{averageRating} / 5</span>
          <div className="flex mt-2">
            <StarRating rating={Math.round(averageRating)} />
          </div>
          <span className="text-gray-500 mt-2">({totalReviews} reviews)</span>
        </div>

        <div className="flex-1 space-y-2">
          {ratingCounts.map(({ star, count }) => (
            <div key={star} className="flex items-center gap-2">
              <span className="w-4">{star}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${(count / totalReviews) * 100}%` }}
                ></div>
              </div>
              <span className="w-6 text-sm text-gray-600">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StarRating = ({ rating }) => {
  return (
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={20} fill={i < rating ? "currentColor" : "none"} strokeWidth={1.5} />
      ))}
    </div>
  );
};

const RatingFeedback = ({ data, pagination, setPagination }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const ratings = Array.isArray(data?.ratings) ? data.ratings : [];

  return (
    <>
      <Loader loading={isProcessing} />
      <div className="p-6 mt-10 bg-white rounded-lg shadow-lg">
        <RatingSummary ratings={ratings} />

        {/* Reviews Section */}
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ratings.length > 0 ? (
            ratings.map((review, index) => (
              <div key={review._id || index} className="p-4 rounded-lg space-y-2 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{review?.user?.name || "Anonymous"}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(review?.starsGiven)} />
                  <p className="text-gray-500 text-sm">
                    ({new Date(review.createdAt).toDateString()})
                  </p>
                </div>
                <p className="text-gray-600">{review?.review}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No reviews available</p>
          )}
        </div>
      </div>
      <Pagination pagination={pagination} setPagination={setPagination} />
    </>
  );
};


export default RatingFeedback;
