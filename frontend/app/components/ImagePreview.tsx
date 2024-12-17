import Image from 'next/image';
import { useState } from 'react';

interface ImagePreviewProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ImagePreview({ src, alt, className = '' }: ImagePreviewProps) {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (isError) {
    return <div className="text-red-500">图片加载失败</div>;
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover rounded-lg"
        onError={() => setIsError(true)}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
} 