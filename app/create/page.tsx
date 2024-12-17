import React, { useEffect } from 'react';
import { message } from 'antd';
import { useRouter } from 'next/navigation';

const CreatePage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (!isConnected && typeof window !== "undefined") {
      setTimeout(() => {
        messageApi.warning("Please connect your wallet first");
        router.replace("/");
      }, 0);
    }
  }, [isConnected, router, messageApi]);

  return (
    // ... existing code ...
  );
};

export default CreatePage; 