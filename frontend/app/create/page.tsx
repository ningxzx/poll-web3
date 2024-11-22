"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useVotingSystem } from "../../hooks/useVotingSystem";
import { useAccount } from "wagmi";
import BackButton from "../components/BackButton";
import { message } from "antd";

export default function CreateProposal() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    options: ["", "", ""] as string[],
  });
  const [useCustomOptions, setUseCustomOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const { createProposal } = useVotingSystem();
  const { isConnected } = useAccount();

  // 检查钱包连接状态，如果未连接则跳转到首页
  useEffect(() => {
    if (!isConnected) {
      message.warning("Please connect your wallet first");
      router.push("/");
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
      });

      // Create the proposal
      const receipt = await createProposal(
        formData.title.trim(),
        formData.description.trim(),
        options
      );

      console.log("Proposal created with receipt:", receipt);
      message.success("Proposal created successfully!");
      
      // Wait a moment for the blockchain to update
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push("/");
    } catch (error: any) {
      console.error("Error creating proposal:", error);
      // Handle user rejection
      if (error.message.includes("User denied transaction")) {
        message.info("Transaction cancelled by user");
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
            <ConnectButton showBalance={false} />
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
                Proposal Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white 
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter proposal title"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white 
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter proposal description (optional)"
              />
            </div>

            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomOptions}
                  onChange={(e) => setUseCustomOptions(e.target.checked)}
                  className="sr-only peer"
                />
                <div
                  className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 
                            peer-focus:ring-purple-500/25 rounded-full peer 
                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:border-gray-300 after:border after:rounded-full 
                            after:h-5 after:w-5 after:transition-all
                            peer-checked:bg-purple-500"
                ></div>
                <span className="ml-3 text-sm font-medium text-gray-300">
                  Use Custom Options
                </span>
              </label>
            </div>

            {useCustomOptions && (
              <div className="space-y-4">
                <div className="text-sm font-medium text-gray-300 mb-2">
                  Voting Options (2-3)
                </div>
                {formData.options.map((option, index) => (
                  <input
                    key={index}
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white 
                             focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={`Option ${index + 1}`}
                  />
                ))}
              </div>
            )}

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={
                  !formData.title.trim() || isSubmitting || !isConnected
                }
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 
                         ${
                           !formData.title.trim() ||
                           isSubmitting ||
                           !isConnected
                             ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                             : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
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
