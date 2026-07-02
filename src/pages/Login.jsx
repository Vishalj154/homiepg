import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import logo from '../assets/logo.jpeg'

export default function Login() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { signIn, signUp } = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (isSignUp) {
            const { error } = await signUp(email, password, fullName)
            if (error) setError(error.message)
            else setError('Check your email to confirm your account!')
        } else {
            const { error } = await signIn(email, password)
            if (error) setError(error.message)
            else navigate('/dashboard')
        }

        setLoading(false)
    }

    async function handleGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/dashboard`
            }
        })
        if (error) setError(error.message)
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <img src={logo} alt="HomiePG" className="h-16 mx-auto mb-3" />
                    <h1 className="text-2xl font-bold text-homie-blue">HomiePG</h1>
                    <p className="text-gray-500 text-sm">Owner Dashboard</p>
                </div>

                {/* Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                    <button
                        onClick={() => setIsSignUp(false)}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${!isSignUp ? 'bg-homie-blue text-white' : 'text-gray-500'
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsSignUp(true)}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${isSignUp ? 'bg-homie-blue text-white' : 'text-gray-500'
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Google Button */}
                <button
                    onClick={handleGoogle}
                    className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-all mb-4"
                >
                    <img src="https://www.google.com/favicon.ico" className="h-4 w-4" />
                    Continue with Google
                </button>

                {/* Divider */}
                <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-400">or continue with email</span>
                    </div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                        <div>
                            <label className="text-sm text-gray-600 mb-1 block">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                placeholder="Your full name"
                                required
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-homie-blue"
                            />
                        </div>
                    )}
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@email.com"
                            required
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-homie-blue"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-homie-blue"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-homie-blue text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    )
}