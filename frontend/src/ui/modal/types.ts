export type EmailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}