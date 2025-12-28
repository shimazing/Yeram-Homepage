import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageAlt: string;
}

export default function PhotoModal({ isOpen, onClose, imageUrl, imageAlt }: PhotoModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-white hover:text-church-accent-green z-10"
          onClick={onClose}
        >
          <X size={24} />
        </Button>
        <div className="bg-white rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full max-h-[70vh] object-contain bg-gray-100"
          />
          {imageAlt && (
            <div className="p-6 bg-white">
              <p className="text-gray-800 text-center text-lg">{imageAlt}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
