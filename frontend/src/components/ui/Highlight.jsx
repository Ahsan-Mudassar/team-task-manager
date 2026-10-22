export default function Highlight({ text, query }) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.split(
        new RegExp(`(${escaped})`, 'gi'))
        .map((part, i) =>
            part.toLowerCase() === query.toLowerCase()
                ? <mark key={i} className="rounded bg-[#fef3c7] px-0.5 text-inherit">{part}</mark>
                : part
        );
}