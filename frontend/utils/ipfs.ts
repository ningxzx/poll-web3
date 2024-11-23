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
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to upload to IPFS");
    }

    const data = await res.json();
    return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
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
  return url;
};
