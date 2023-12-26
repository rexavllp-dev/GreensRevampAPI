import multer from 'multer';
import sharp from 'sharp';
import path from 'path';


const storage = multer.memoryStorage();

export const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const allowedMimes = ['image/jpeg', 'image/pdf'];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG and PDF are allowed.'));
      }
    },
  });


  export const resizeAndUpload = async (file) => {
  const filename = `trn-${Date.now()}.pdf`;
  await sharp(file.buffer)
          .resize({ width: 300, height: 300 })
          .toFormat('pdf')
          .toFile(path.join(__dirname, `../../images/${filename}`));
      return filename;
};