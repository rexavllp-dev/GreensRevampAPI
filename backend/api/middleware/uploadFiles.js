import { getFileFormats } from "../helpers/getFileFormat.js";
/**
 * Middleware function to upload files.
 * @param {Object} fileProps - The properties of the file.
 * @param {string} [fileProps.formatType] - The format type of the file. Default is 'all'.
 * @param {string} fileProps.key - The key of the file in the request object.
 * @param {string} fileProps.name - The name of the file.
 * @returns {Function} - The middleware function.
 */



export const uploadFiles = (fileProps) => {
    const formatType = fileProps?.formatType || 'all';
    const allowedFileFormats = getFileFormats(formatType);
    return function async(req, res, next) {
        if (req.files) {
            const files = Array.isArray(req.files[fileProps.key]) ? req.files[fileProps.key] : [req.files[fileProps.key]];
            const fileData = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const ext = file.mimetype.split("/")[1].toLowerCase();

                if (allowedFileFormats.length > 0 && !allowedFileFormats.includes(ext)) {
                    return res.status(500).json({
                        status: 500,
                        success: false,
                        message: `Only ${formatType} files are allowed. ${ext} is not a valid ${formatType} format.`
                    });
                }

                const num = Math.ceil(Math.random() * 200);
                const name = `egt_${fileProps.name}_${Date.now()}`;
                const imgname = name + num; 
                const img_path = `${imgname}.${ext}`;

                // file.mv('./public/images' + img_path, (err) => {
                //     if (err) {
                //         return res.status(500).json({
                //             status: 500,
                //             success: false,
                //             message: "File uploading failed",
                //         });
                //     }
                // });

                // console.log(file);

                // fileData.push({
                //     originalName: file.name,
                //     fileName: img_path,
                //     size: (file.size / 1000000).toFixed(2) + " MB",
                //     mimetype: file.mimetype,
                //     extension: ext
                // });

                fileData.push(file)
            }

            req.fileData = fileData;
            next();
        } else {
            next();
        }
    };
};