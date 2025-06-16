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
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl max-h-full">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-white hover:text-church-accent-green z-10"
          onClick={onClose}
        >
          <X size={24} />
        </Button>
        <img
          src={imageUrl}
          alt={imageAlt}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
}
