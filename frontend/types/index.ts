export interface Option {
  text: string;
  votes: bigint;
}

export interface Proposal {
  id: number;
  creator: string;  // address
  title: string;
  description: string;
  coverImage?: string;  // 封面图片 URL
  options: {
    text: string;
    votes: bigint;
  }[];
  isCustomVoting: boolean;
  hasVoted?: boolean;
  selectedOption?: number;
}
