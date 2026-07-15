import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useLogin } from '../hooks/useAuth'
import { apiErrorMessage } from '../api/client'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })
  const loginMutation = useLogin()

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-honey-50 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-ink-900 text-2xl font-black text-honey-400">
            W
          </div>
          <h1 className="text-2xl font-extrabold text-ink-900">Welcome back</h1>
          <p className="mt-1 text-sm text-ink-400">Log in to keep your crew coordinated.</p>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit((values) => loginMutation.mutate(values))}
        >
          <Input
            label="Email"
            type="email"
            icon={<Mail size={18} />}
            placeholder="you@studio.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            icon={<Lock size={18} />}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          {loginMutation.isError && (
            <p className="text-sm text-coral-600">{apiErrorMessage(loginMutation.error)}</p>
          )}

          <Button type="submit" size="lg" loading={loginMutation.isPending} className="mt-2">
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400">
          New to Workive?{' '}
          <Link to="/register" className="font-semibold text-honey-600">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
