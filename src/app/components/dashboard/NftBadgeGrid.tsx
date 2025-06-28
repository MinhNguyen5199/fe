'use client';

import Image from 'next/image';
import { useState } from 'react';
import { UserNftBadge } from '../../lib/types';

interface NftBadgeGridProps {
  badges: UserNftBadge[];
}

const fallbackImage = 'https://placehold.co/96x96/1F2937/7C3AED?text=?';

const NftBadgeCard = ({ badge }: { badge: UserNftBadge }) => {
  const [imgSrc, setImgSrc] = useState(badge.nft_badges.image_url);

  return (
    <div
      className="group bg-gray-800 p-4 rounded-lg text-center border border-gray-700 hover:border-purple-500 hover:shadow-xl transition-all"
    >
      <div className="w-24 h-24 mx-auto relative">
        <Image
          src={imgSrc || fallbackImage}
          alt={badge.nft_badges.name}
          width={96}
          height={96}
          className="rounded-full object-cover border-4 border-gray-700 group-hover:border-purple-500 transition-all"
          onError={() => setImgSrc(fallbackImage)}
        />
      </div>
      <h4 className="font-bold mt-3 text-white truncate">{badge.nft_badges.name}</h4>
      <p className="text-xs text-gray-400 mt-1 h-8 overflow-hidden">{badge.nft_badges.description}</p>
      <a
        href={`https://testnet.explorer.perawallet.app/asset/${badge.algorand_asset_id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-blue-400 hover:text-blue-300 text-xs mt-3 font-semibold"
      >
        View on Explorer &rarr;
      </a>
    </div>
  );
};

const NftBadgeGrid = ({ badges }: NftBadgeGridProps) => {
  if (!badges || badges.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-gray-800 rounded-lg border border-dashed border-gray-600">
        <p className="text-gray-400">No badges earned yet.</p>
        <p className="text-gray-500 text-sm mt-1">Complete quests to unlock them!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {badges.map((badge) => (
        <NftBadgeCard key={badge.algorand_asset_id} badge={badge} />
      ))}
    </div>
  );
};

export default NftBadgeGrid;
