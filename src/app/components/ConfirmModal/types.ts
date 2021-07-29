export interface ConfirmModalProps {
  title?: string;
  hidePrompt?: boolean;
  description?: string;
  isOpen?: boolean;
  isLoading?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
}
