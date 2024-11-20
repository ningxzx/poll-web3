import { ethers } from 'ethers';
import { NextResponse } from 'next/server';

const VOTING_SYSTEM_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const VOTING_SYSTEM_ABI = [
  "function getProposalDetails(uint256 _proposalId) public view returns (address creator, string title, string description, uint256 votesFor, uint256 votesAgainst)"
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545/');
    const contract = new ethers.Contract(VOTING_SYSTEM_ADDRESS, VOTING_SYSTEM_ABI, provider);
    
    const proposalId = parseInt(params.id);
    const proposal = await contract.getProposalDetails(proposalId);
    
    return NextResponse.json({
      creator: proposal[0],
      title: proposal[1],
      description: proposal[2],
      votesFor: proposal[3],
      votesAgainst: proposal[4],
    });
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposal' },
      { status: 500 }
    );
  }
}
