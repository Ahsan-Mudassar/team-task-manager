import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import { getInitials } from '../../utils/format';

export default function TeamCard({ team }) {
  return (
    <Link
      to={`/teams/${team.id}`}
      className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm ring-1 ring-transparent transition hover:shadow-md hover:ring-primary/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-[#eaedff] font-bold text-primary">
          {getInitials(team.name)}
        </div>
        <Badge tone={team.role}>{team.role}</Badge>
      </div>
      <div>
        <h3 className="font-semibold text-ink">{team.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{team.description || 'No description'}</p>
      </div>
    </Link>
  );
}