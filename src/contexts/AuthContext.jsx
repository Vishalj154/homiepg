import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { fetchProfileForUser, signInWithRole, signUpWithRole } from '../services/auth.service'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        async function initSession() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!isMounted) return
            const currentUser = session?.user ?? null
            setUser(currentUser)
            if (currentUser) {
                const currentProfile = await fetchProfileForUser(currentUser.id)
                setProfile(currentProfile)
            } else {
                setProfile(null)
            }
            setLoading(false)
        }

        initSession()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!isMounted) return
            const currentUser = session?.user ?? null
            setUser(currentUser)
            if (currentUser) {
                const currentProfile = await fetchProfileForUser(currentUser.id)
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