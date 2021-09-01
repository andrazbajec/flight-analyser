import fs from "fs";

class FileHelper {
    static writeFile(name: string, content: string) {
        fs.writeFile(`data/${name}`, content, function (err) {
            if (err) {
                console.log(err.message);
            } else {
                console.log(`File ${name} written successfully!`);
            }
        })
    }
}

export default FileHelper;