const TONES = {
    owner: 'bg-[#eaedff] text-primary',
    member: 'bg-slate-100 text-muted'
};

export default function Badge({ tone = 'member', children }) {
    return (
        <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold capitalize ${TONES[tone]}`}>
            {children}
        </span>
    );
}