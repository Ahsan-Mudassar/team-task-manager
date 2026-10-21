import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = 'Confirm',
    loading,
    onConfirm,
    onClose
}) {
    return (
        <Modal open={open} title={title} onClose={onClose}>
            <p className="text-sm text-muted">{message}</p>
            <div className="mt-6 flex justify-end gap-2">
                <Button size="sm" variant="secondary" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button size="sm" variant="danger" onClick={onConfirm} loading={loading}>
                    {confirmLabel}
                </Button>
            </div>
        </Modal>
    );
}