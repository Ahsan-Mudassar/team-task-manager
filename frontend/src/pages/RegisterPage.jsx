import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import useAuth from '../hooks/useAuth';
import { validateRegister } from '../utils/validators';
import { getErrorMessage, getFieldErrors } from '../utils/errors.js';
import usePageTitle from '../hooks/usePageTitle.js';

export default function RegisterPage() {
    usePageTitle('Create account');
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

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
        const validation = validateRegister(form);
        if (Object.keys(validation).length) return setErrors(validation);

        setSubmitting(true);
        try {
            await register(form);
            toast.success('Account created');
            navigate('/', { replace: true });
        } catch (err) {
            const fieldErrors = getFieldErrors(err);

            if (Object.keys(fieldErrors).length) setErrors(fieldErrors);
            else toast.error(getErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Start managing your team's tasks in minutes"
            footer={
                <>
                    Already have an account?{' '}
                    <Link to="/login" className="font-semibold text-primary">Log in</Link>
                </>
            }
        >
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <Input
                    label="Full Name"
                    name="name"
                    icon={User}
                    autoComplete="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name} />
                <Input
                    label="Work Email"
                    name="email"
                    type="email"
                    icon={Mail}
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email} />

                <div>
                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        icon={Lock}
                        autoComplete="new-password"
                        placeholder="Min 8 characters"
                        value={form.password}
                        onChange={handleChange}
                        error={errors.password}
                    />
                    {
                        !errors.password && <p className="mt-1.5 text-xs text-muted">Use letters and numbers, at least 8 characters.</p>
                    }

                </div>

                <Button type="submit" loading={submitting} className="mt-2">
                    Create account {!submitting && <ArrowRight size={14} />}
                </Button>
            </form>
        </AuthLayout>
    );
}