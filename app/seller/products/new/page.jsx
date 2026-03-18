"use client";

import React, { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InfoIcon from "@mui/icons-material/Info";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    name: "", brand: "", category: "", description: "", 
    size: "", condition: "", retailPrice: "", sellingPrice: "" 
  });
  const [images, setImages] = useState([]);

  const isFilled = Object.entries(formData).every(([key, value]) => value) && images.length > 0;

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const uploadedFiles = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...uploadedFiles].slice(0, 4));
    }
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFilled) {
      router.push("/seller/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center p-4 font-roboto">
      <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-sm overflow-hidden animate-fadeIn pb-12">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => router.back()}
                className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-brand-dark transition-all underline decoration-brand-pink decoration-2"
              >
                <ArrowBackIcon sx={{ fontSize: 20 }} />
              </button>
              <div className="flex flex-col">
                 <h2 className="text-[20px] font-bold text-brand-dark">Product Listing</h2>
                 <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Create New Submission</p>
              </div>
           </div>
           <div className="p-2.5 px-3 bg-brand-pink/5 rounded-full flex items-center gap-2 text-brand-pink">
              <InfoIcon sx={{ fontSize: 18 }} />
              <span className="text-[11px] font-bold uppercase tracking-tight">Active Step: Basics</span>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 flex flex-col gap-8">
           {/* Section 1: Photos */}
           <div className="flex flex-col gap-4">
              <h3 className="text-[14px] font-bold text-brand-dark uppercase tracking-widest pl-3 border-l-4 border-brand-pink">Visuals</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {/* Uploaded Images */}
                 {images.map((img, index) => (
                    <div key={index} className="aspect-square bg-gray-50 rounded-[24px] border border-gray-100 relative overflow-hidden group">
                       <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                       <button 
                         type="button"
                         onClick={() => handleRemoveImage(index)}
                         className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         &times;
                       </button>
                    </div>
                 ))}

                 {/* Upload Button visible if slots left */}
                 {images.length < 4 && (
                   <label className="aspect-square bg-white border-2 border-dashed border-gray-300 rounded-[24px] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-pink hover:bg-brand-pink/5 transition-all text-gray-400 hover:text-brand-pink relative overflow-hidden">
                      <AddPhotoAlternateIcon sx={{ fontSize: 28 }} />
                      <span className="text-[11px] font-bold uppercase tracking-tight text-center px-2 z-10">Add Photos<br/>(Max 4)</span>
                      <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                   </label>
                 )}

                 {/* Empty State placehholders */}
                 {[...Array(Math.max(0, 3 - images.length))].map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square bg-gray-50 rounded-[24px] border border-gray-100 opacity-50 flex items-center justify-center text-gray-300">
                        <AddPhotoAlternateIcon sx={{ fontSize: 20 }} />
                    </div>
                 ))}
              </div>
              <div className="p-4 bg-orange-50/50 rounded-2xl flex items-center gap-3 border border-orange-100">
                 <InfoIcon className="text-orange-400 scale-75" />
                 <p className="text-[12px] font-medium text-orange-700 italic">"All this information will be seen by the buyers"</p>
              </div>
           </div>

           {/* Section 2: Details */}
           <div className="flex flex-col gap-6">
              <h3 className="text-[14px] font-bold text-brand-dark uppercase tracking-widest pl-3 border-l-4 border-brand-pink">Product Detail</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input label="Product Name" placeholder="e.g. Vintage Denim Jacket" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                 <Input label="Brand" placeholder="e.g. Levi's, Zara" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} />
                 
                 <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-brand-dark uppercase tracking-widest pl-1">Category</label>
                    <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="h-[54px] px-6 border border-gray-200 rounded-full bg-gray-50/50 text-[14px] text-brand-dark font-bold cursor-pointer outline-none focus:border-brand-pink focus:bg-white transition-all">
                       <option value="">Select Category</option>
                       <option value="vintage">Vintage</option>
                       <option value="formals">Formals</option>
                       <option value="streetwear">Streetwear</option>
                    </select>
                 </div>

                 <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-brand-dark uppercase tracking-widest pl-1">Condition</label>
                    <select value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})} className="h-[54px] px-6 border border-gray-200 rounded-full bg-gray-50/50 text-[14px] text-brand-dark font-bold cursor-pointer outline-none focus:border-brand-pink focus:bg-white transition-all">
                       <option value="">Select Condition</option>
                       <option value="New">Brand New</option>
                       <option value="Used">Gently Used</option>
                       <option value="Vintage">Vintage</option>
                    </select>
                 </div>

                 <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-[12px] font-bold text-brand-dark uppercase tracking-widest pl-1">Description</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Shared your story about this product..." className="min-h-[120px] p-6 border border-gray-200 rounded-[28px] bg-gray-50/50 text-[14px] text-brand-dark font-medium outline-none focus:border-brand-pink focus:bg-white transition-all resize-none" />
                 </div>

                 <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-brand-dark uppercase tracking-widest pl-1">Available Sizes</label>
                    <select value={formData.size} onChange={(e) => setFormData({...formData, size: e.target.value})} className="h-[54px] px-6 border border-gray-200 rounded-full bg-gray-50/50 text-[14px] text-brand-dark font-bold cursor-pointer outline-none focus:border-brand-pink focus:bg-white transition-all">
                       <option value="">Select Size</option>
                       <option value="S">Small</option>
                       <option value="M">Medium</option>
                       <option value="L">Large</option>
                    </select>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <Input label="Retail Price" placeholder="MRP" value={formData.retailPrice} onChange={(e) => setFormData({...formData, retailPrice: e.target.value})} />
                    <Input label="Selling Price" placeholder="Offer Price" value={formData.sellingPrice} onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})} />
                 </div>
              </div>
           </div>

           <Button 
             type="submit" 
             fullWidth 
             disabled={!isFilled}
             className="h-[54px] rounded-full font-bold text-[16px] mt-8 shadow-xl shadow-brand-pink/20"
           >
             Sell Product
           </Button>
        </form>
      </div>
    </div>
  );
}
