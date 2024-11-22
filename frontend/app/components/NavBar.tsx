"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount } from "wagmi";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function NavBar() {
  const { isConnected } = useAccount();
  const pathname = usePathname();

  return (
    <nav className="glass-effect fixed top-0 w-full z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className={`text-lg transition-all duration-200 ${
                pathname === "/"
                  ? "text-purple-300 font-semibold"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <Image
                src="/images/vote-for-fun-icon.png"
                width={32}
                height={32}
                alt="Logo"
                className="rounded-full"
              />
            </Link>
            <Link
              href="/"
              className={`text-lg transition-all duration-200 ${
                pathname === "/"
                  ? "text-purple-300 font-semibold"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Playground
            </Link>
            {isConnected && (
              <Link
                href="/dashboard"
                className={`text-lg transition-all duration-200 ${
                  pathname === "/dashboard"
                    ? "text-purple-300 font-semibold"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isConnected && (
              <Link
                href="/create"
                className="px-4 py-2 rounded-lg transition-all duration-200 bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 border border-pink-500/20"
              >
                Create Proposal
              </Link>
            )}
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                mounted,
              }) => {
                const ready = mounted;
                const connected = ready && account && chain;

                return (
                  <div
                    {...(!ready && {
                      "aria-hidden": true,
                      style: {
                        opacity: 0,
                        pointerEvents: "none",
                        userSelect: "none",
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 
                                     hover:bg-purple-500/30 transition-all duration-200 
                                     border border-purple-500/20"
                          >
                            Connect Wallet
                          </button>
                        );
                      }

                      return (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={openAccountModal}
                            className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 
                                     hover:bg-purple-500/30 transition-all duration-200 
                                     border border-purple-500/20"
                          >
                            {account.displayName}
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    </nav>
  );
}
