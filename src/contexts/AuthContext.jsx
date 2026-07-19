import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { fetchProfileForUser, signInWithRole, signUpWithRole, normalizeRole } from '../services/auth.service'
import { upsertProfile } from '../services/profile.service'

const AuthContext = createContext()

/**
 * Ensures a profile row exists for the given user.
 * If not, creates one using the pending OAuth role from localStorage,
 * user_metadata, or defaults to 'tenant'.
 */
async function ensureProfile(user) {
    let profile = await fetchProfileForUser(user.id)
    if (profile) return profile

    // Determine role: localStorage (set before OAuth redirect) > user_metadata > default
    const pendingRole = localStorage.getItem('homiepg_pending_role')
    localStorage.removeItem('homiepg_pending_role')
    const role = normalizeRole(pendingRole || user.user_metadata?.role || 'tenant')
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || ''

    const { data } = await upsertProfile({
        id: user.id,
        full_name: fullName,
        email: user.email,
        role,
    })

    return data || await fetchProfileForUser(user.id)
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        async function initSession() {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (!isMounted) return
                const currentUser = session?.user ?? null
                setUser(currentUser)
                if (currentUser) {
                    const currentProfile = await ensureProfile(currentUser)
                    setProfile(currentProfile)
                } else {
                    setProfile(null)
                }
            } catch (err) {
                console.error("Session init error:", err)
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        initSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!isMounted) return
            const currentUser = session?.user ?? null
            setUser(currentUser)
            if (currentUser) {
                const currentProfile = await ensureProfile(currentUser)
                setProfile(currentProfile)
            } else {
                setProfile(null)
            }
            setLoading(false)
        })

        return () => {
            isMounted = false
            subscription.unsubscribe()
        }
    }, [])

    async function signUp(email, password, fullName, role = 'tenant') {
        return signUpWithRole(email, password, fullName, role)
    }

    async function signIn(email, password, role = 'tenant') {
        return signInWithRole(email, password, role)
    }

    async function signOut() {
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
    }

    return (
        <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}