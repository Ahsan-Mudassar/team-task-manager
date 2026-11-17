import { useMemo } from 'react';

export default function useDirty(values, initial) {
    return useMemo(
        () => Object.keys(initial).some((k) => (values[k] ?? '') !== (initial[k] ?? '')),
        [values, initial]
    );
}