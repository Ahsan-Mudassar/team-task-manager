import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { getInitials } from '../../utils/format';

export default function MemberList({ members, currentUserId, isOwner, onRemove }) {
  return (
    <ul className="divide-y divide-line">
      {members.map((m) => {
        const role = m.TeamMember.role;
        const isSelf = m.id === currentUserId;
        const canRemove = role !== 'owner' && (isOwner || isSelf);

        return (
          <li key={m.id} className="flex items-center gap-3 py-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#eaedff] text-xs font-bold text-primary">
              {getInitials(m.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">
                {m.name} {isSelf && <span className="text-muted">(you)</span>}
              </p>
              <p className="truncate text-xs text-muted">{m.email}</p>
            </div>
            <Badge tone={role}>{role}</Badge>
            
            {canRemove && (
              <Button size="sm" variant="secondary" onClick={() => onRemove(m)}>
                {isSelf ? 'Leave' : 'Remove'}
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
}