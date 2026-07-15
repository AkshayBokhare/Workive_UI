import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Mail, Lock, User } from 'lucide-react'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useRegister } from '../hooks/useAuth'
import { apiErrorMessage } from '../api/client'

const schema = z.object({
  full_name: z.string().min(1, 'Your name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
})

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })
  const registerMutation = useRegister()

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-honey-50 px-6 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-ink-900 text-2xl font-black text-honey-400">
            W
          </div>
          <h1 className="text-2xl font-extrabold text-ink-900">Build your crew</h1>
          <p className="mt-1 text-sm text-ink-400">Set up your Workive profile in a minute.</p>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit((values) => registerMutation.mutate(values))}
        >
          <Input
            label="Full name"
            icon={<User size={18} />}
            placeholder="Your full name"
            error={errors.full_name?.message}
            {...register('full_name')}
          />
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
            placeholder="At least 8 characters"
            error={errors.password?.message}
            {...register('password')}
          />

          {registerMutation.isError && (
            <p className="text-sm text-coral-600">{apiErrorMessage(registerMutation.error)}</p>
          )}

          <Button type="submit" size="lg" loading={registerMutation.isPending} className="mt-2">
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-honey-600">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
