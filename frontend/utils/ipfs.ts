/**
 * Upload file to IPFS using Pinata
 * @param file File to upload
 * @param apiKey Pinata API key
 * @returns IPFS URL
 */

const jwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0YzBmNTc4Zi00MDQ0LTQ3YmItYTc3Yi0xZjkzOGY2Zjc4NTIiLCJlbWFpbCI6InRoaW5reHp4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIyMmYyODY5ZWQzYTZlODliNzVjOSIsInNjb3BlZEtleVNlY3JldCI6IjhjM2UwNjkzNjE0Mzk0NTcwZDI2M2JlMzM5NWE0YmFkNGUzYmZlNzFjZThkOTA5ZGMxMWRiMzQyYjliMGYzY2IiLCJleHAiOjE3NjM4NzQ5Mzd9.xxMDN_FNZfeH4cJkmyK2TfvBYtI6RrFofE9IfC9rN9M";
export const uploadToIPFS = async (
  file: File,
): Promise<string> => {
  try {
    console.log('Starting IPFS upload:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      body: formData,
    });

    console.log('Pinata response status:', res.status);

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Pinata error:', errorData);
      throw new Error(errorData.message || "上传到 IPFS 失败");
    }

    const data = await res.json();
    console.log('Pinata success response:', data);
    
    if (!data.IpfsHash) {
      throw new Error("IPFS 响应数据无效");
    }

    // 构建完整的 IPFS URL
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
    console.log('Generated IPFS URL:', ipfsUrl);

    return ipfsUrl;
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw error;
  }
};

/**
 * Get IPFS URL for display
 * @param url IPFS or regular URL
 * @returns URL for display
 */
export const getIPFSUrl = (url: string): string => {
  if (!url) return "";
  
  // 如果已经是完整的 URL，直接返回
  if (url.startsWith('http')) {
    return url;
  }
  
  // 如果是 IPFS hash，添加网关前缀
  if (url.startsWith('ipfs://')) {
    return url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
  }
  
  return url;
};

// 添加 URL 验证函数
export const isValidImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return contentType?.startsWith('image/') ?? false;
  } catch {
    return false;
  }
};
