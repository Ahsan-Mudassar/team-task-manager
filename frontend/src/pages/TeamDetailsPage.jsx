import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { ErrorState } from '../components/ui/StateViews';
import TeamFormModal from '../components/teams/TeamFormModal';
import MemberList from '../components/teams/MemberList';
import AddMemberForm from '../components/teams/AddMemberForm';
import useFetch from '../hooks/useFetch';
import useAuth from '../hooks/useAuth';
import { deleteTeam, getTeam, removeMember } from '../api/team.api.js';
import { getErrorMessage } from '../utils/errors';
import useTeams from '../hooks/useTeams';
import usePageTitle from '../hooks/usePageTitle.js';

export default function TeamDetailsPage() {
    const { reload: refreshTeams } = useTeams();
    const { teamId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { data: team, setData, loading, error, reload } = useFetch(() => getTeam(teamId), [teamId]);
    usePageTitle(team?.name ?? 'Team');
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState(null);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (teamId) {
            localStorage.setItem('lastVisitedTeamId', teamId)
        }
    }, [teamId])

    if (loading) return <Spinner />;
    if (error) {
        const notFound = error.status === 404;
        return (
            <ErrorState
                message={notFound ? 'This team does not exist, or you are not a member.' : error.message}
                onRetry={notFound ? undefined : reload}
                backTo="/teams"
            />
        );
    }

    const myRole = team.members.find((m) => m.id === user.id)?.TeamMember.role;
    const isOwner = myRole === 'owner';

    const handleDeleteTeam = async () => {
        setBusy(true);
        try {
            await deleteTeam(team.id);
            toast.success('Team deleted');
            refreshTeams();
            navigate('/teams', { replace: true });
        } catch (err) {
            toast.error(getErrorMessage(err));
            setDeleteOpen(false);
        } finally {
            setBusy(false);
        }
    };

    const handleRemoveMember = async () => {
        const member = memberToRemove;
        const isSelf = member.id === user.id;
        setBusy(true);
        try {
            await removeMember(team.id, member.id);
            if (isSelf) {
                toast.success('You left the team');
                refreshTeams();
                navigate('/teams', { replace: true });
                return;
            }
            setData((prev) => ({
                ...prev,
                members: prev.members.filter((m) => m.id !== member.id)
            }));

            toast.success(`${member.name} removed`);
        } catch (err) {
            toast.error(getErrorMessage(err));
        } finally {
            setBusy(false);
            setMemberToRemove(null);
        }
    };

    const handleMemberAdded = (m) =>
        setData((prev) => ({
            ...prev,
            members: [
                ...prev.members,
                {
                    id: m.id,
                    name: m.name,
                    email: m.email,
                    TeamMember: {
                        role: m.role
                    }
                }],
        }));

    return (
        <div className="flex flex-col gap-6">
            <Link to="/teams" className="inline-flex w-fit items-center gap-1 text-sm text-muted hover:text-ink">
                <ArrowLeft size={14} /> All teams
            </Link>

            <section className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-start sm:justify-between sm:p-6">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="wrap-break-word text-2xl font-bold tracking-tight text-ink">{team.name}</h1>
                        <Badge tone={myRole}>{myRole}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted">{team.description || 'No description'}</p>
                </div>
                {isOwner && (
                    <div className="flex shrink-0 gap-2">
                        <Button size="sm" variant="secondary" onClick={() => setEditOpen(true)}>
                            <Pencil size={14} /> Edit
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => setDeleteOpen(true)}>
                            <Trash2 size={14} /> Delete
                        </Button>
                    </div>
                )}
            </section>

            <section className="rounded-xl bg-white p-5 shadow-sm sm:p-6">
                <h2 className="mb-4 text-lg font-bold text-ink">Members ({team.members.length})</h2>
                {isOwner && (
                    <div className="mb-4 border-b border-line pb-5">
                        <AddMemberForm teamId={team.id} onAdded={handleMemberAdded} />
                        <p className="mt-2 text-xs text-muted">The person must already have a TaskFlow account.</p>
                    </div>
                )}
                <MemberList
                    members={team.members}
                    currentUserId={user.id}
                    isOwner={isOwner}
                    onRemove={setMemberToRemove} />
            </section>

            <TeamFormModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                team={team}
                onSaved={(updated) => { setData((prev) => ({ ...prev, ...updated })); refreshTeams(); }} />

            <ConfirmDialog
                open={deleteOpen}
                title="Delete team?"
                confirmLabel="Delete team"
                loading={busy}
                message="This permanently deletes the team and all of its tasks. This cannot be undone."
                onConfirm={handleDeleteTeam}
                onClose={() => setDeleteOpen(false)} />

            <ConfirmDialog
                open={Boolean(memberToRemove)}
                loading={busy}
                title={memberToRemove?.id === user.id ? 'Leave team?' : 'Remove member?'}
                confirmLabel={memberToRemove?.id === user.id ? 'Leave' : 'Remove'}
                message={memberToRemove?.id === user.id
                    ? 'You will lose access to this team and its tasks.'
                    : `${memberToRemove?.name} will lose access, and their tasks will become unassigned.`}
                onConfirm={handleRemoveMember}
                onClose={() => setMemberToRemove(null)} />
        </div>
    );
}