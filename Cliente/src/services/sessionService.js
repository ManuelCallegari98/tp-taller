// src/services/sessionService.js
export const sessionService = {
    setSession(userData) {
        sessionStorage.setItem('user', JSON.stringify(userData));
    },

    getSession() {
        const user = sessionStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    clearSession() {
        sessionStorage.removeItem('user');
    },

    isAdmin() {
        const user = this.getSession();
        return user?.isAdmin || false;
    },

    isAuthenticated() {
        return !!this.getSession();
    }
};