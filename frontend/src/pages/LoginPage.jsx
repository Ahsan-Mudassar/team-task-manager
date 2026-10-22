import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import useAuth from '../hooks/useAuth';
import { validateLogin } from '../utils/validators';
import { getErrorMessage, getFieldErrors } from '../utils/errors.js';
import usePageTitle from '../hooks/usePageTitle.js';

export default function LoginPage() {
  usePageTitle('Log in');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
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
    const validation = validateLogin(form);
    if (Object.keys(validation).length) return setErrors(validation);

    setSubmitting(true);
    try {
      await login(form);
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
      title="Welcome back"
      subtitle="Enter your credentials to access your TaskFlow workspace"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-primary">Register</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
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

        <Input
          label="Password"
          name="password"
          type="password"
          icon={Lock} autoComplete="current-password"
          placeholder="Your password"
          value={form.password}
          onChange={handleChange}
          error={errors.password} />

        <Button type="submit" loading={submitting} className="mt-2">
          Log in {!submitting && <ArrowRight size={14} />}
        </Button>
      </form>
    </AuthLayout>
  );
}