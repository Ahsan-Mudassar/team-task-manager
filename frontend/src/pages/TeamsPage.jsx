import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { EmptyState, ErrorState } from '../components/ui/StateViews';
import TeamCard from '../components/teams/TeamCard';
import TeamFormModal from '../components/teams/TeamFormModal';
import useTeams from '../hooks/useTeams';

export default function TeamsPage() {
    const navigate = useNavigate();
    const { teams, loading, error, reload } = useTeams();
    const [createOpen, setCreateOpen] = useState(false);

    const newTeamButton = (
        <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus size={14} /> New team
        </Button>
    );

    const renderContent = () => {
        if (loading) return <Spinner />;
        if (error) return <ErrorState message={error.message} onRetry={reload} />;

        if (!teams.length) {
            return (
                <EmptyState
                    icon={Users}
                    title="No teams yet"
                    text="Create your first team to start organizing tasks with your members."
                    action={newTeamButton} />
            );
        }
        return (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {
                    teams.map((t) => <TeamCard key={t.id} team={t} />)
                }
            </div>
        );
    };

    return (
        <>
            <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-ink">Teams</h1>
                    <p className="text-sm text-muted">Teams you own or belong to</p>
                </div>
                {teams?.length > 0 && newTeamButton}
            </div>

            {renderContent()}

            <TeamFormModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onSaved={(team) => navigate(`/teams/${team.id}`)} />
        </>
    );
}