export class CommonsHelper {

    static formatDate(date: Date | null) {
        if (date != null) {
            const definedDate = new Date(date);

            const day = definedDate.getDate().toString().padStart(2, '0');
            const month = (definedDate.getMonth() + 1).toString().padStart(2, '0');
            const year = definedDate.getFullYear();
            return `${day}. ${month}. ${year}`;
        } else {
            return null;
        }
    }

    static validateUsername = (username: string) => {
        return username.length >= 5;
    };

    static validatePhoneNumber = (phoneNumber: string) => {
        const hasNineDigits = /^\d{9}$/;
        return hasNineDigits.test(phoneNumber);
    };

    static validatePassword = (password: string) => {
        const hasNumber = /\d/;
        const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        return password.length >= 8 && hasNumber.test(password) && hasSymbol.test(password);
    };

    static async hashPassword(password: string | null): Promise<string> {
        if (!password) {
            throw new Error("Password is undefined");
        }

        const encoder = new TextEncoder();
        const passwordData = encoder.encode(password);

        const hashedBuffer = await crypto.subtle.digest("SHA-256", passwordData);
        const hashedArray = new Uint8Array(hashedBuffer);

        return Array.from(hashedArray)
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    }

}