import { Loader2 } from 'lucide-react';

export default function Spinner() {
  return (
    <div className="flex justify-center items-center py-20" role="status" aria-label="Loading">
      <Loader2 className="animate-spin text-primary w-10" />
    </div>
  );
}