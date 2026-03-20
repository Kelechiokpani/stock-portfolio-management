import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
  variant?: "default" | "destructive";
}

export function ConfirmActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading,
  variant = "default",
}: ConfirmActionModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-black text-xl tracking-tight uppercase">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 font-medium">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="rounded-xl font-bold uppercase text-[10px] tracking-widest border-2">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className={`rounded-xl font-bold uppercase text-[10px] tracking-widest px-6 ${
              variant === "destructive" ? "bg-red-600" : "bg-blue-600"
            }`}
          >
            {isLoading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
            Proceed
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}