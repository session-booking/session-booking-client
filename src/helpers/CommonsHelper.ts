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

    static generateRandomColor() {
        return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

}