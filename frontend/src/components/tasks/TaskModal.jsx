import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import useDirty from '../../hooks/useDirty';
import { createTask, updateTask } from '../../api/tasks.api';
import { getTeam } from '../../api/team.api';
import { validateTask } from '../../utils/validators';
import { getErrorMessage, getFieldErrors } from '../../utils/errors';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../../utils/task';

const FORM_ID = 'task-form';

const buildInitial = (task, teams, defaultTeamId) =>
  task
    ? {
      title: task.title,
      description: task.description ?? '',
      teamId: task.teamId,
      assigneeId: task.assigneeId ?? '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ?? '',
    }
    : {
      title: '', description: '', assigneeId: '', status: 'todo', priority: 'medium', dueDate: '',
      teamId: defaultTeamId || teams[0]?.id || '',
    };

function TaskModalContent({ onClose, task, teams, defaultTeamId, onSaved }) {
  const isEdit = Boolean(task);
  const [initial] = useState(() => buildInitial(task, teams, defaultTeamId));
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isDirty = useDirty(form, initial);

  useEffect(() => {
    if (!form.teamId) {
      setMembers([]);
      return undefined;
    }
    let ignore = false;
    setMembersLoading(true);
    getTeam(form.teamId)
      .then((t) => !ignore && setMembers(t.members))
      .catch(() => {
        if (ignore) return;
        setMembers([]);
        toast.error('Could not load team members');
      })
      .finally(() => !ignore && setMembersLoading(false));
    return () => { ignore = true; };
  }, [form.teamId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value, ...(name === 'teamId' && { assigneeId: '' }) }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateTask(form);
    if (Object.keys(validation).length) return setErrors(validation);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || null,
      assigneeId: form.assigneeId || null,
    };
    if (!isEdit) payload.teamId = form.teamId;

    setSubmitting(true);
    try {
      if (isEdit) await updateTask(task.id, payload);
      else await createTask(payload);

      toast.success(isEdit ? 'Task updated' : 'Task created');
      onSaved();
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
      size="lg"
      title={isEdit ? 'Edit task' : 'Create task'}
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
            {isEdit ? 'Save changes' : 'Create task'}
          </Button>
        </>
      }
    >
      <form id={FORM_ID} onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Title"
          name="title"
          placeholder="e.g. Design login screen"
          value={form.title}
          onChange={handleChange}
          error={errors.title} />
        <Textarea
          label="Description (optional)"
          name="description"
          placeholder="Add more details…"
          value={form.description}
          onChange={handleChange}
          error={errors.description} />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Team"
            name="teamId"
            value={form.teamId}
            onChange={handleChange
            } error={errors.teamId}
            disabled={isEdit}
            options={teams.map((t) => ({
              value: t.id,
              label: t.name
            }))}
            placeholder="Select team" />
          <Select
            label="Assignee" name="assigneeId"
            value={form.assigneeId}
            onChange={handleChange}
            disabled={!form.teamId || membersLoading}
            placeholder={membersLoading ? 'Loading…' : 'Unassigned'}
            options={members.map((m) => ({
              value: m.id,
              label: m.name
            }))} />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          <Select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={STATUS_OPTIONS} />
          <Select
            label="Priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            options={PRIORITY_OPTIONS} />
          <div className="col-span-2 sm:col-span-1">
            <Input
              label="Due date"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange} error={errors.dueDate} />
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default function TaskModal({ open, ...props }) {
  return open ? <TaskModalContent {...props} /> : null;
}