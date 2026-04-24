"use client";

import { QrCode as QRIcon } from 'lucide-react';

export function QRCode({ value }: { value: string }) {
  // A placeholder for an actual QR Code component (like qrcode.react)
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl w-32 h-32">
      <QRIcon className="w-16 h-16 text-black" />
      <span className="text-[10px] text-gray-500 mt-2 truncate w-full text-center">{value}</span>
    </div>
  );
}
