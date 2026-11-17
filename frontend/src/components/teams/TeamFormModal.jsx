import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import useDirty from '../../hooks/useDirty';
import { createTeam, updateTeam } from '../../api/team.api';
import { validateTeam } from '../../utils/validators';
import { getErrorMessage, getFieldErrors } from '../../utils/errors';

const FORM_ID = 'team-form';

function TeamFormContent({ onClose, team, onSaved }) {
    const isEdit = Boolean(team);
    const [initial] = useState(() => ({
        name: team?.name ?? '',
        description: team?.description ?? ''
    }));
    const [form, setForm] = useState(initial);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const isDirty = useDirty(form, initial);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        setErrors((er) => ({ ...er, [name]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validation = validateTeam(form);
        if (Object.keys(validation).length) return setErrors(validation);

        const payload = {
            name: form.name.trim(),
            description: form.description.trim()
        };
        setSubmitting(true);
        try {
            const saved = isEdit ? await updateTeam(team.id, payload) : await createTeam(payload);
            toast.success(isEdit ? 'Team updated' : 'Team created');
            onSaved(saved);
            onClose();
        } catch (err) {
            const fieldErrors = getFieldErrors(err);
            if (Object.keys(fieldErrors).length) setErrors(fieldErrors);
            else toast.error(getErrorMessage(err));
            setSubmitting(false);
        }
    };

    return (
        <Modal
            open
            title={isEdit ? 'Edit team' : 'Create team'}
            onClose={onClose}
            isDirty={isDirty}
            locked={submitting}
            footer={
                <>
                    <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={onClose}
                        disabled={submitting}>
                        Cancel
                    </Button>
                    <Button type="submit" form={FORM_ID} size="sm" loading={submitting}>
                        {isEdit ? 'Save changes' : 'Create team'}
                    </Button>
                </>
            }
        >
            <form id={FORM_ID} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <Input
                    label="Team name"
                    name="name"
                    placeholder="e.g. Frontend Squad"
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name} />
                <Textarea
                    label="Description (optional)"
                    name="description"
                    placeholder="What does this team work on?"
                    value={form.description}
                    onChange={handleChange}
                    error={errors.description} />
            </form>
        </Modal>
    );
}

export default function TeamFormModal({ open, ...props }) {
    return open ? <TeamFormContent {...props} /> : null;
}