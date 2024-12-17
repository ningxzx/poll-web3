"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVotingSystem } from "../../hooks/useVotingSystem";
import { useAccount } from "wagmi";
import BackButton from "../components/BackButton";
import { message, Image } from "antd";
import { uploadToIPFS } from "@/utils/ipfs";
import ImagePreview from "../components/ImagePreview";

export default function CreateProposal() {
  const router = useRouter();
  const { isConnected } = useAccount();
  
  // 将 message hook 移到组件内部
  const [messageApi, contextHolder] = message.useMessage();

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

  useEffect(() => {
    if (!isConnected && typeof window !== "undefined") {
      // 使用 setTimeout 将消息显示移到下一个事件循环
      setTimeout(() => {
        messageApi.warning("Please connect your wallet first");
        router.replace("/");
      }, 0);
    }
  }, [isConnected, router, messageApi]);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 文件类型检查
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        messageApi.error('Only JPG, PNG, GIF and WebP formats are supported');
        return;
      }

      // 文件大小检查
      if (file.size > 5 * 1024 * 1024) {
        messageApi.error('Image size cannot exceed 5MB');
        return;
      }

      // 显示上传中状态
      const loadingMessage = messageApi.loading('Uploading image...', 0);

      try {
        const ipfsUrl = await uploadToIPFS(file);
        console.log('IPFS upload successful:', ipfsUrl);

        setPreviewImage(ipfsUrl);
        setFormData(prev => ({
          ...prev,
          coverImage: ipfsUrl
        }));

        loadingMessage();
        messageApi.success('Image uploaded successfully!');
      } catch (ipfsError) {
        console.error('IPFS upload error:', ipfsError);
        loadingMessage();
        messageApi.error('Failed to upload image to IPFS, please try again');
      }
    } catch (error) {
      console.error('Image processing error:', error);
      messageApi.error('Image processing failed, please try again');
    }
  };

  // 添加图片压缩函数
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // 设置最大尺寸
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            'image/jpeg',
            0.7  // 压缩质量
          );
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Base64 转换函数
  const convertToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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
      // 基本验证
      if (!formData.title.trim()) {
        setError("标题不能为空");
        return;
      }

      // 验证图片大小
      if (formData.coverImage) {
        const base64Size = formData.coverImage.length * 0.75; // 估算base64大小
        if (base64Size > 5 * 1024 * 1024) {
          setError("图片大小超过限制");
          return;
        }
      }

      // 创建提案
      const receipt = await createProposal(
        formData.title.trim(),
        formData.description.trim(),
        formData.options.filter(Boolean),
        formData.coverImage
      );

      messageApi.success("提案创建成功！");
      router.replace("/");
    } catch (error: any) {
      console.error("创建提案失败:", error);
      setError(error.message || "创建提案失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 添加删除图片的处理函数
  const handleDeleteImage = () => {
    setPreviewImage('');
    setFormData(prev => ({
      ...prev,
      coverImage: ''
    }));
    messageApi.success('Image removed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* 添加 message 上下文 */}
      {contextHolder}
      
      <nav className="glass-effect fixed top-0 w-full z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center relative">
            <div className="flex items-center space-x-4">
              <BackButton />
            </div>
            <h1 className=" absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
              Create New Proposal
            </h1>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-24 pb-12">
        <div className="bg-gray-800/50 backdrop-blur-md p-8 rounded-xl border border-gray-700">
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
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                {previewImage ? (
                  <div className="w-1/3 space-y-2">
                    <ImagePreview
                      src={previewImage}
                      alt="Cover preview"
                      className="w-full h-32 max-h-32 object-cover rounded-lg"
                    />
                    <div className="flex gap-2">
                      <label
                        htmlFor="coverImage"
                        className="flex-1 px-3 py-1 text-xs text-center bg-purple-500 hover:bg-purple-600 rounded cursor-pointer"
                      >
                        Replace
                        <input
                          type="file"
                          id="coverImage"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <button
                        onClick={handleDeleteImage}
                        className="flex-1 px-3 py-1 text-xs text-center bg-red-500 hover:bg-red-600 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="w-1/3">
                    <label
                      htmlFor="coverImage"
                      className="flex items-center justify-center h-32 px-4 transition bg-gray-700 border-2 border-gray-600 border-dashed rounded-lg appearance-none cursor-pointer hover:border-purple-500/50 focus:outline-none"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm text-gray-400">
                          Upload image
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
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-400 space-y-2">
                    <p>Max file size: 5MB</p>
                    <p>Supported formats: JPG, PNG, GIF, WebP</p>
                    <p>Recommended size: 800x600px</p>
                  </p>
                </div>
              </div>
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
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
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
