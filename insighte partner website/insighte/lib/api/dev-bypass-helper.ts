/**
 * DEV BYPASS UTILITIES
 * Used to provide consistent mock data when auth is bypassed in development.
 */

export const MOCK_USER_ID = "00000000-0000-0000-0000-000000000000";

export function getDevBypassRole(): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(/(^|;)\s*insighte-dev-role\s*=\s*([^;]+)/);
    return match ? match[2] : null;
}

export function isDevBypassActive(): boolean {
    return process.env.NODE_ENV === 'development' && !!getDevBypassRole();
}

export function getMockUser() {
    const role = getDevBypassRole();
    if (!role) return null;
    
    return {
        id: MOCK_USER_ID,
        email: `dev-${role}@insighte.com`,
        app_metadata: { app_role: role },
        user_metadata: { full_name: `Dev ${role.charAt(0).toUpperCase() + role.slice(1)}` }
    };
}
