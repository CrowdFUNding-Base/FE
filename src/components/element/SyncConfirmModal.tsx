'use client';

import React from 'react';

interface SyncConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'wallet' | 'google';
  data: {
    walletAddress?: string;
    email?: string;
    currentUser?: {
      email?: string;
      walletAddress?: string;
    };
  };
  isLoading?: boolean;
}

export default function SyncConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  type,
  data,
  isLoading = false,
}: SyncConfirmModalProps) {
  if (!isOpen) return null;

  const title =
    type === 'wallet'
      ? 'Sync Wallet with Your Account'
      : 'Sync Google Account with Your Wallet';

  const message =
    type === 'wallet'
      ? `Do you want to connect wallet address ${data.walletAddress?.slice(0, 6)}...${data.walletAddress?.slice(-4)} to your Google account (${data.currentUser?.email})?`
      : `Do you want to connect your Google account (${data.email}) to your wallet address ${data.currentUser?.walletAddress?.slice(0, 6)}...${data.currentUser?.walletAddress?.slice(-4)}?`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className="text-gray-700 mb-4">{message}</p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm text-blue-800 font-medium mb-1">
                  What this means:
                </p>
                <ul className="text-sm text-blue-700 space-y-1">
                  {type === 'wallet' ? (
                    <>
                      <li>• Your wallet will be linked to your Google account</li>
                      <li>• You can login with both methods</li>
                      <li>• All your data will be consolidated</li>
                    </>
                  ) : (
                    <>
                      <li>• Your Google account will be linked to your wallet</li>
                      <li>• You can login with both methods</li>
                      <li>• All your data will be consolidated</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Syncing...
              </>
            ) : (
              'Confirm Sync'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
