'use server'

import { cookies } from 'next/headers';

export async function getCookie(name: string) {
    try {
        const cookieStore = cookies();
        const cookie = await cookieStore.get(name);
        return cookie ?? undefined;  // Return cookie value or undefined if not found
    } catch (error) {
        console.error('Error getting cookie:', error);
        return undefined;  // Handle errors gracefully
    }
}

export async function removeCookie(name: string) {
    try {
        await cookies().delete(name);
    } catch (error) {
        console.error('Error removing cookie:', error);
    }
}
