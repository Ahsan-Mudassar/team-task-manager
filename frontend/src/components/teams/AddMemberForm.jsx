import { useState } from 'react';
import { Mail, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { addMember } from '../../api/team.api';
import { validateMemberEmail } from '../../utils/validators';
import { getErrorMessage } from '../../utils/errors';

const FIELD_STATUSES = [400, 404, 409];

export default function AddMemberForm({ teamId, onAdded }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState();
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const invalid = validateMemberEmail(email);
        if (invalid) return setError(invalid);

        setSubmitting(true);
        try {
            const member = await addMember(teamId, {
                email: email.trim()
            });

            toast.success(`${member.name} added to the team`);
            setEmail('');
            onAdded(member);
        } catch (err) {
            const message = getErrorMessage(err);

            if (FIELD_STATUSES.includes(err.response?.status)) setError(message);
            else toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="flex-1">
                <Input
                    label="Add member by email"
                    name="memberEmail"
                    type="email" icon={Mail}
                    placeholder="teammate@company.com" value={email}
                    error={error}
                    onChange={(e) => { setEmail(e.target.value); setError(undefined); }}
                />
            </div>

            <Button type="submit" size="sm" loading={submitting} className="sm:mt-6.5">
                <UserPlus size={14} /> Add
            </Button>
        </form>
    );
}