import axios from "axios";

class FetchHelper {
    static get(url: string, data: any = {}): any {
        return new Promise((resolve, reject) => {
            axios.get(url, data)
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error.message)
                })
        })
    }
}

export default FetchHelper;