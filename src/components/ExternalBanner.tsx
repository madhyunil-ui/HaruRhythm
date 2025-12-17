
import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function ExternalBanner() {
    return (
        <a
            href="https://dreambridgehq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-between p-4 bg-[#556B2F] text-white rounded-xl shadow-md transition-all active:scale-95 hover:bg-[#465a26] group"
        >
            <div className="flex flex-col">
                <span className="text-sm font-bold">더 많은 성장을 원하시나요?</span>
                <span className="text-xs text-white/80">DreamBridge 방문하기</span>
            </div>
            <ExternalLink size={20} className="text-white opacity-80 group-hover:opacity-100 transition-opacity" />
        </a>
    );
}
