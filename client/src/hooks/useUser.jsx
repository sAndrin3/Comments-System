export function useUser() {
    const match = document.cookie.match(/(?:^|;\s*)userId=(?<id>[^;]+)/);
    return { id: match?.groups?.id ?? null };
}
