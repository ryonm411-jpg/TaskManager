interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}


export function ConfirmDialog({ message, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      data-testid="confirm-dialog">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
        <p className="text-sm text-slate-700 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel}
            className="px-4 py-2 text-sm border rounded hover:bg-slate-50">
            Cancel
          </button>
          <button onClick={onConfirm} data-testid="confirm-delete-btn"
            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
