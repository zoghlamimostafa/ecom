import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const postQuery = async (contactData) => {
    try {
        const response = await axios.post(`${base_url}enquiry`, contactData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const contactService = {
    postQuery,
};

export default contactService;
