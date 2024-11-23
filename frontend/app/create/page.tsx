"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVotingSystem } from "../../hooks/useVotingSystem";
import { useAccount } from "wagmi";
import BackButton from "../components/BackButton";
import { message, Image } from "antd";

export default function CreateProposal() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    options: ["", "", ""] as string[],
    coverImage: "",
  });
  const [useCustomOptions, setUseCustomOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string>("");
  const { createProposal } = useVotingSystem();
  const { isConnected } = useAccount();

  // 检查钱包连接状态，如果未连接则跳转到首页
  useEffect(() => {
    if (!isConnected) {
      message.warning("Please connect your wallet first");
      router.replace("/");
    }
  }, [isConnected, router]);

  // 如果未连接钱包，不渲染页面内容
  if (!isConnected) {
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // 清除之前的错误
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        message.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        setFormData(prev => ({
          ...prev,
          coverImage: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) => (i === index ? value : opt)),
    }));
    setError(""); // 清除之前的错误
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Validate form
      if (!formData.title.trim()) {
        setError("Title is required");
        setIsSubmitting(false);
        return;
      }

      // Validate title length
      if (formData.title.trim().length < 10) {
        setError("Title must be at least 10 characters long");
        setIsSubmitting(false);
        return;
      }

      // Get options based on voting type
      const options = useCustomOptions ? formData.options.filter(Boolean) : [];

      // Validate custom options
      if (useCustomOptions && options.length < 2) {
        setError("Please provide at least 2 options for custom voting");
        setIsSubmitting(false);
        return;
      }

      console.log("Submitting proposal:", {
        title: formData.title.trim(),
        description: formData.description.trim(),
        options,
        coverImage: formData.coverImage,
      });

      // Create the proposal
      const receipt = await createProposal(
        formData.title.trim(),
        formData.description.trim(),
        options,
        formData.coverImage
      );

      console.log("Proposal created with receipt:", receipt);
      message.success("Proposal created successfully!");
      
      // Use router.replace instead of router.push to avoid the render error
      router.replace("/");
    } catch (error: any) {
      console.error("Error creating proposal:", error);
      // Handle user rejection
      if (error.message.includes("User denied transaction")) {
        message.info("Transaction cancelled by user");
      } else if (error.message.includes("title already exists")) {
        message.error("A proposal with this title already exists");
        setError("Please choose a different title for your proposal");
      } else {
        // Handle other errors
        setError(error.message || "Failed to create proposal. Please try again.");
        message.error("Failed to create proposal");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <nav className="fixed top-0 w-full z-50 bg-gray-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 mb-6">
              <BackButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-24 pb-12">
        <div className="bg-gray-800/50 backdrop-blur-md p-8 rounded-xl border border-gray-700">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
            Create New Proposal
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/20 rounded-lg text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Proposal Title (minimum 10 characters)
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                minLength={10}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white 
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         placeholder-gray-400"
                placeholder="Enter your proposal title"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white 
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         placeholder-gray-400 resize-none"
                placeholder="Describe your proposal"
              />
            </div>

            {/* Cover Image Upload */}
            <div>
              <label
                htmlFor="coverImage"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Cover Image (Optional)
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="coverImage"
                    className="flex items-center justify-center w-full h-32 px-4 transition bg-gray-700 border-2 border-gray-600 border-dashed rounded-lg appearance-none cursor-pointer hover:border-purple-500/50 focus:outline-none"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-gray-400">
                        Click to upload image
                      </span>
                    </div>
                    <input
                      type="file"
                      id="coverImage"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                {previewImage && (
                  <div className="relative w-32 h-32">
                    <Image
                      src={previewImage}
                      alt="Cover preview"
                      width={128}
                      height={128}
                      className="object-cover rounded-lg"
                      preview={{
                        mask: (
                          <div className="flex flex-col items-center justify-center space-y-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs">Preview</span>
                          </div>
                        ),
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage("");
                        setFormData(prev => ({ ...prev, coverImage: "" }));
                      }}
                      className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-400">
                Max file size: 5MB. Recommended size: 800x600px
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-300">
                  Voting Options
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useCustomOptions}
                    onChange={(e) => setUseCustomOptions(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                  <span className="ms-3 text-sm font-medium text-gray-300">
                    Custom Options
                  </span>
                </label>
              </div>

              {useCustomOptions ? (
                <div className="space-y-3">
                  {formData.options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white 
                               focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               placeholder-gray-400"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-400">
                  Using default Yes/No options
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-4 py-3 text-white rounded-lg transition-all duration-200
                         ${
                           isSubmitting
                             ? "bg-purple-500/50 cursor-not-allowed"
                             : "bg-purple-500 hover:bg-purple-600"
                         }`}
              >
                {isSubmitting ? "Creating..." : "Create Proposal"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
