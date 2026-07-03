import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/logo.png'

export default function Navbar({ showBack = false }) {
    const { profile, signOut } = useAuth()
    const navigate = useNavigate()

    async function handleSignOut() {
        navigate('/')
        await signOut()
    }

    return (
        <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {showBack && (
                    <button onClick={() => navigate('/dashboard')} className="text-homie-blue mr-2">
                        ←
                    </button>
                )}
                <img
                    src={logo}
                    alt="HomiePG"
                    style={{ height: "60px", width: "auto" }}
                />
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                    👋 {profile?.full_name || 'Owner'}
                </span>
                <button
                    onClick={handleSignOut}
                    className="text-sm bg-red-50 text-red-500 px-4 py-1.5 rounded-lg hover:bg-red-100 transition-all"
                >
                    Sign Out
                </button>
            </div>
        </nav>
    )
}