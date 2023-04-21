// models/Example.ts
import axios from 'axios';

// @ts-ignore
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:3000';

class Example {
    async getAll() {
        try {
            const response = await axios.get(`${baseUrl}/examples`);
            return response.data;
        } catch (error) {
            console.error('Error fetching examples:', error);
            return [];
        }
    }
}

export default new Example();
