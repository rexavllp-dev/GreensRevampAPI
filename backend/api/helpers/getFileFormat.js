

export const getFileFormats = (type) => {
    let allowedFileFormats = [];

    if (type === 'image') {
        allowedFileFormats = ["jpg", "jpeg", "png", "gif", "webp"];
    }
    if (type === 'video') {
        allowedFileFormats = ["mp4", "avi", "mkv", "3gp"];
    }
    if (type === 'pdf') {
        allowedFileFormats = ["pdf"];
    }
    if (type === 'doc') {
        allowedFileFormats = ["doc", "docx"];
    }
    if (type === 'xls') {
        allowedFileFormats = ["xls", "xlsx"];
    }
    if (type === 'ppt') {
        allowedFileFormats = ["ppt", "pptx"];
    }
    if (type === 'zip') {
        allowedFileFormats = ["zip", "rar"];
    }
    if (type === 'csv') {
        allowedFileFormats = ["csv"];
    }
    if (type === 'txt') {
        allowedFileFormats = ["txt"];
    }
    if (type === 'audio') {
        allowedFileFormats = ["mp3", "wav"];
    }
    if (type === 'all') {
        allowedFileFormats = [];
    }

    return allowedFileFormats;
}