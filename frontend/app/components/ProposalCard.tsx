"use client";

import { Proposal } from "@/types";
import { message } from "antd";
import Image from "next/image";
import { useState } from "react";
import { Modal } from "antd";

interface ProposalCardProps {
  proposal: Proposal;
  userVotes: Record<number, { voted: boolean; optionIndex: number }>;
  isConnected: boolean;
  onVote: (proposalId: number, optionIndex: number) => void;
}

export default function ProposalCard({
  proposal,
  userVotes,
  isConnected,
  onVote,
}: ProposalCardProps) {
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const currentVote = userVotes[proposal.id];
  const hasVotedOnThis = currentVote?.voted;
  const totalVotes = proposal.options.reduce(
    (sum, option) => sum + Number(option.votes),
    0
  );

  // 根据选项数量决定颜色
  const getOptionColor = (index: number, total: number) => {
    if (total <= 2) {
      return index === 0 ? "green" : "red";
    }
    // 三个选项时的颜色
    const colors = ["green", "orange", "red"];
    return colors[index];
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      green: {
        bg: "bg-green-900/20",
        border: "border-green-500/30",
        text: "text-green-300",
        button: "bg-green-900/40 hover:bg-green-800",
        voted: "bg-green-800/30",
        progress: "bg-green-600/50",
      },
      orange: {
        bg: "bg-orange-900/20",
        border: "border-orange-500/30",
        text: "text-orange-300",
        button: "bg-orange-900/40 hover:bg-orange-800",
        voted: "bg-orange-800/30",
        progress: "bg-orange-600/50",
      },
      red: {
        bg: "bg-red-900/20",
        border: "border-red-500/30",
        text: "text-red-300",
        button: "bg-red-900/40 hover:bg-red-800",
        voted: "bg-red-800/30",
        progress: "bg-red-600/50",
      },
    };
    return colorMap[color as keyof typeof colorMap];
  };

  console.log(proposal.coverImage);

  return (
    <div className="relative p-4 rounded-lg bg-gray-800/40 hover:bg-gray-800 backdrop-blur-md border border-white/10 hover:border-white/40 shadow-lg hover:shadow-2xl transition-all duration-300 group">
      {/* Voted Stamp */}
      {hasVotedOnThis && (
        <div className="absolute -top-2 -right-2 rotate-12 flex items-center justify-center z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-sm"></div>
            <div className="relative px-4 py-1 border-2 border-red-500/50 rounded-full bg-red-900/40 backdrop-blur-sm">
              <span className="font-dancing-script text-red-300 text-lg font-bold">
                Voted
              </span>
            </div>
          </div>
        </div>
      )}

      <div>
        {/* Left content */}
        <div className="flex-1">
          <div className="flex gap-4 justify-between">
            <div className="min-h-[120px] mb-4">
              <h3 className="text-lg font-semibold mb-2 text-white/90 group-hover:text-white">
                {proposal.title}
              </h3>
              <p
                className={`text-sm min-h-[48px] ${
                  proposal.description
                    ? "text-white/80 group-hover:text-white"
                    : "text-white/20 group-hover:text-white/40"
                }`}
              >
                {proposal.description || "No description provided"}
              </p>
            </div>
            {/* Right content - Image */}
            {proposal.coverImage && (
              <div className="flex-none fit-content">
                <div
                  className="relative aspect-square w-[120px] overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setIsImageModalVisible(true)}
                >
                  <Image
                    src={proposal.coverImage}
                    alt={proposal.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-gray-700/30 group-hover:bg-gray-700 rounded-full mb-4 overflow-hidden flex">
            {hasVotedOnThis &&
              proposal.options.map((option, index) => {
                const voteCount = Number(option.votes);
                const percentage =
                  totalVotes === 0 ? 0 : (voteCount / totalVotes) * 100;
                const color = getOptionColor(index, proposal.options.length);
                const colorClasses = getColorClasses(color);

                return percentage > 0 ? (
                  <div
                    key={index}
                    className={`h-full ${colorClasses.progress} group-hover:bg-opacity-100 transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                ) : null;
              })}
          </div>
        </div>
        {/* Options Grid */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-row gap-2">
            {proposal.options.map((option, index) => {
              const isVotedOption =
                hasVotedOnThis && currentVote.optionIndex === index;
              const isDisabled = hasVotedOnThis || !isConnected;
              const color = getOptionColor(index, proposal.options.length);
              const colorClasses = getColorClasses(color);
              const voteCount = Number(option.votes);
              const percentage =
                totalVotes === 0 ? 0 : (voteCount / totalVotes) * 100;

              return (
                <button
                  key={index}
                  onClick={() => {
                    if (!isConnected && typeof window !== "undefined") {
                      message.warning("Please connect your wallet to vote");
                      return;
                    }
                    if (!isDisabled) {
                      onVote(proposal.id, index);
                    }
                  }}
                  disabled={isDisabled}
                  className={`flex-1 p-3 rounded-lg border transition-all duration-300 ${
                    isVotedOption ? colorClasses.voted : colorClasses.button
                  } ${
                    isVotedOption ? colorClasses.border : "border-transparent"
                  } ${
                    isDisabled && !isVotedOption
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  } backdrop-blur-sm group-hover:backdrop-blur-none`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className={`text-sm font-medium ${colorClasses.text}`}
                    >
                      {option.text}
                    </span>
                    <span className="text-xs text-gray-400 group-hover:text-gray-200">
                      {hasVotedOnThis ? (
                        <>
                          {voteCount} votes ({percentage.toFixed(1)}%)
                        </>
                      ) : (
                        <span className="text-gray-500">? votes</span>
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <Modal
        open={isImageModalVisible}
        footer={null}
        onCancel={() => setIsImageModalVisible(false)}
        width={800}
        centered
        className="image-preview-modal"
      >
        <Image
          src={proposal.coverImage || ""}
          alt={proposal.title}
          width={800}
          height={600}
          className="w-full h-auto object-contain"
        />
      </Modal>
    </div>
  );
}
