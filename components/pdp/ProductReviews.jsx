"use client";

import React, { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@/components/Button";
import { motion, AnimatePresence } from "framer-motion";

// Default Configuration Object
const DEFAULT_CONFIG = {
  title: "Customer Reviews",
  writeReviewTitle: "Review this product",
  modalTitle: "Write a customer review",
  rating: {
    label: "Rating",
    placeholder: "Select a rating"
  },
  review: {
    label: "Comment",
    placeholder: "Enter comment"
  },
  reviewTitle: {
    label: "Title",
    placeholder: "Enter title"
  },
  submitButton: "Submit",
  successMessage: "Thank you for your review!",
};

// Mock data for initial state
const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "David",
    rating: 5,
    title: "Excellent choice!",
    comment: "This product is outstanding! Everything about it feels top-notch, from material to functionality.",
    date: "2026-03-11",
    verified: true
  },
  {
    id: 2,
    name: "Jack",
    rating: 2,
    title: "Disappointed",
    comment: "Not as expected. The material feels cheap, and it didn't fit well. Wouldn't buy again.",
    date: "2026-03-11",
    verified: true
  },
  {
    id: 3,
    name: "George",
    rating: 4,
    title: "Very satisfied",
    comment: "Good product! High quality and worth the price. Would consider buying again.",
    date: "2026-03-11",
    verified: true
  },
  {
    id: 4,
    name: "Jack",
    rating: 5,
    title: "Good product",
    comment: "This product is amazing, I love it! The quality is top notch, the material is comfortable and breathable.",
    date: "2026-03-11",
    verified: true
  }
];

const RATING_STATS = [
  { star: 5, percentage: 61 },
  { star: 4, percentage: 10 },
  { star: 3, percentage: 5 },
  { star: 2, percentage: 8 },
  { star: 1, percentage: 16 }
];

export default function ProductReviews({ config = DEFAULT_CONFIG }) {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [title, setTitle] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRating || !reviewText) return;

    const newReview = {
      id: Date.now(),
      name: "User",
      rating: selectedRating,
      title: title,
      comment: reviewText,
      date: new Date().toISOString().split('T')[0],
      verified: true
    };

    setReviews([newReview, ...reviews]);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsModalOpen(false);
      setSelectedRating(0);
      setReviewText("");
      setTitle("");
      setIsSubmitted(false);
    }, 2000);
  };

  return (
    <section className="flex flex-col gap-12 py-12 border-t border-[#F0F0F0] font-roboto">
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Left: Rating Summary & Breakdown */}
        <div className="w-full lg:w-[320px] flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-[20px] font-bold text-brand-dark">{config.title}</h3>
            <div className="flex items-center gap-3">
              <div className="flex text-brand-pink">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} sx={{ fontSize: 24 }} className={i < 4 ? "text-brand-pink" : "text-gray-200"} />
                ))}
              </div>
              <span className="text-[16px] font-bold text-brand-dark">4.2 out of 5</span>
            </div>
            <p className="text-[13px] text-gray-400 font-medium">104 ratings</p>
          </div>

          <div className="flex flex-col gap-3">
            {RATING_STATS.map((stat) => (
              <div key={stat.star} className="flex items-center gap-4 group cursor-pointer">
                <span className="text-[13px] font-bold text-brand-dark w-10">
                  {stat.star} star
                </span>
                <div className="flex-1 h-2.5 bg-brand-light rounded-full overflow-hidden border border-gray-100">
                  <div 
                    className="h-full bg-brand-pink transition-all duration-500"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
                <span className="text-[12px] font-bold text-gray-500 w-8 text-right group-hover:text-brand-pink transition-colors">
                  {stat.percentage}%
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-5 mt-8 bg-brand-light p-8 rounded-[24px] border border-gray-100">
            <h4 className="text-[16px] font-bold text-brand-dark uppercase tracking-tight">{config.writeReviewTitle}</h4>
            <p className="text-[13px] text-gray-500 leading-relaxed font-medium">
              Share your thoughts with other customers to help them make better decisions.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full h-[48px] text-[14px] font-bold text-brand-pink border-2 border-brand-pink rounded-full hover:bg-brand-pink hover:text-white transition-all duration-200"
            >
              Write a customer review
            </button>
          </div>
        </div>

        {/* Right: Existing Reviews Cards */}
        <div className="flex-1 flex flex-col gap-6">
          <h4 className="text-[16px] font-bold text-brand-dark uppercase tracking-widest mb-2">Customer Feedback</h4>
          {reviews.map((rev) => (
            <div key={rev.id} className="p-8 border border-[#F0F0F0] rounded-[24px] flex flex-col gap-5 bg-white hover:border-brand-pink/20 transition-all duration-300">
              <div className="flex justify-between items-start w-full">
                <div className="flex flex-col gap-1">
                  <h5 className="text-[16px] font-bold text-brand-dark leading-tight">{rev.title}</h5>
                  <div className="flex text-brand-pink">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        sx={{ fontSize: 18 }} 
                        className={i < rev.rating ? "text-brand-pink" : "text-gray-200"} 
                      />
                    ))}
                  </div>
                </div>
                {rev.verified && (
                  <span className="text-[11px] font-bold text-[#C45500] bg-orange-50 px-2 py-1 rounded-[4px] uppercase tracking-tighter">
                    Verified Purchase
                  </span>
                )}
              </div>
              
              <p className="text-[15px] text-[#555555] font-normal leading-relaxed">
                {rev.comment}
              </p>

              <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-[12px] font-bold text-brand-purple border border-gray-100">
                    {rev.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-brand-dark">{rev.name}</span>
                    <span className="text-[11px] font-medium text-gray-400">{rev.date}</span>
                  </div>
                </div>
                <button className="text-[12px] font-bold text-brand-purple hover:text-brand-pink transition-colors">
                  Helpful?
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-dark/40 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-[500px] bg-white rounded-[32px] shadow-2xl overflow-hidden p-9"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[20px] font-bold text-brand-dark uppercase tracking-tight">{config.modalTitle}</h3>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-brand-pink transition-all">
                  <CloseIcon />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-bold text-brand-dark uppercase tracking-widest">{config.reviewTitle.label}</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={config.reviewTitle.placeholder}
                        className="h-[54px] px-6 border border-gray-200 rounded-full outline-none focus:border-gray-300 focus:ring-0 transition-all text-[15px] font-medium text-brand-dark bg-gray-50/50"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-bold text-brand-dark uppercase tracking-widest">{config.review.label}</label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder={config.review.placeholder}
                        className="min-h-[140px] p-6 border border-gray-200 rounded-[28px] outline-none focus:border-gray-300 focus:ring-0 transition-all text-[15px] font-medium text-brand-dark bg-gray-50/50 resize-none leading-relaxed"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[12px] font-bold text-brand-dark uppercase tracking-widest">{config.rating.label}</label>
                      <div className="relative">
                        <select 
                          value={selectedRating}
                          onChange={(e) => setSelectedRating(parseInt(e.target.value))}
                          className="w-full h-[54px] px-6 border border-gray-200 rounded-full outline-none appearance-none focus:border-gray-300 transition-all text-[15px] font-bold text-brand-dark bg-gray-50/50 cursor-pointer"
                        >
                          <option value="0">{config.rating.placeholder}</option>
                          <option value="5">5 Stars - Amazing</option>
                          <option value="4">4 Stars - Very Good</option>
                          <option value="3">3 Stars - Good</option>
                          <option value="2">2 Stars - Fair</option>
                          <option value="1">1 Star - Poor</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-brand-pink">
                           <StarIcon sx={{ fontSize: 20 }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button 
                        type="submit"
                        disabled={!selectedRating || !reviewText}
                        className="h-[54px] w-full font-bold text-[16px]"
                      >
                        {config.submitButton}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="py-12 text-center flex flex-col items-center gap-6 animate-fadeIn">
                    <div className="w-20 h-20 bg-brand-pink/10 rounded-full flex items-center justify-center text-brand-pink">
                      <StarIcon sx={{ fontSize: 40 }} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-[20px] font-bold text-brand-dark">Submission Successful!</h4>
                      <p className="text-[14px] text-gray-500 font-medium px-8">{config.successMessage}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
