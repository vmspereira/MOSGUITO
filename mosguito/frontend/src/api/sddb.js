import axios from "axios";
import Constants from "../Constants";

export const baseURL = Constants.sddb_api_url + "api/";

export default axios.create({
    baseURL: baseURL,
    headers: {

    },
});