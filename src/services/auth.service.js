import { supabase } from '../lib/supabase'
import { upsertProfile } from './profile.service'

const ROLE_ALIASES = {
  super_admin: 'super_admin',
  admin: 'super_admin',
  owner: 'owner',
  tenant: 'tenant',
}

export function normalizeRole(role) {
  if (!role) return 'tenant'
  return ROLE_ALIASES[role] || role
}

export function getRoleRedirectPath(role) {
  switch (normalizeRole(role)) {
    case 'super_admin':
      return '/admin/dashboard'
    case 'owner':
      return '/dashboard'
    case 'tenant':
    default:
      return '/tenant'
  }
}

export async function signUpWithRole(email, password, fullName, role = 'tenant') {
  const normalizedRole = normalizeRole(role)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: normalizedRole,
      },
    },
  })

  if (error) return { error, user: null }

  const authUser = data?.user
  if (authUser) {
    const profileResult = await upsertProfile({
      id: authUser.id,
      full_name: fullName,
      email: authUser.email,
      role: normalizedRole,
    })
    if (profileResult.error) {
      return { error: profileResult.error, user: authUser }
    }
  }

  return { error: null, user: authUser }
}

export async function signInWithRole(email, password, role = 'tenant') {
  const normalizedRole = normalizeRole(role)
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error, user: null, profile: null }

  const profile = await fetchProfileForUser(data?.user?.id)
  const profileRole = normalizeRole(profile?.role)
  if (profileRole && profileRole !== normalizedRole) {
    await supabase.auth.signOut()
    return {
      error: { message: `This account is registered as ${profileRole} and cannot access the ${normalizedRole} login.` },
      user: null,
      profile: null,
    }
  }

  return { error: null, user: data?.user, profile }
}

export async function fetchProfileForUser(userId) {
  if (!userId) return null
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) return null
  return data
}
