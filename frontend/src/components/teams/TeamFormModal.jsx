import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { createTeam, updateTeam } from '../../api/team.api';
import { validateTeam } from '../../utils/validators';
import { getErrorMessage, getFieldErrors } from '../../utils/errors';

export default function TeamFormModal({ open, onClose, team, onSaved }) {
    const isEdit = Boolean(team);
    const [form, setForm] = useState({
        name: '',
        description: ''
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setForm({
                name: team?.name ?? '',
                description: team?.description ?? ''
            });
            setErrors({});
        }
    }, [open, team]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({
            ...f,
            [name]: value
        }));
        setErrors((er) => ({
            ...er,
            [name]: undefined
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validation = validateTeam(form);
        if (Object.keys(validation).length) return setErrors(validation);

        const payload = { name: form.name.trim(), description: form.description.trim() };
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
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal open={open} title={isEdit ? 'Edit team' : 'Create team'} onClose={onClose}>
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <Input
                    label="Team name"
                    name="name"
                    placeholder="e.g. Frontend Squad"
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name}
                    autoFocus />

                <Textarea
                    label="Description (optional)"
                    name="description"
                    placeholder="What does this team work on?"
                    value={form.description}
                    onChange={handleChange}
                    error={errors.description} />

                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={onClose}>
                        Cancel
                    </Button>
                    
                    <Button
                        type="submit"
                        size="sm"
                        loading={submitting}>
                        {isEdit ? 'Save changes' : 'Create team'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}