import dayjs from "dayjs";
import axios from "axios";
import FileHelper from "./FileHelper";

class FetchHelper {
    static get(url: string, config: any, functionName = '') {
        const time = dayjs().format('YYYY-MM-DD_HH-mm-ss');
        const fileName = `${time}_${functionName}.json`;

        return new Promise((resolve, reject) => {
            axios.get(url, config)
                .then(response => {
                    FileHelper.writeFile(fileName, JSON.stringify(response.data));
                    resolve(response.data);
                })
                .catch(error => {
                    console.log(error.message);
                    reject(error.message)
                })
        })
    }
}

export default FetchHelper;