import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ApiError } from '../utils/apiError.js';

const UPLOADS_DIR = 'uploads';
const AR_UPLOADS_DIR = 'uploads/ar-models';

// Ensure uploads directories exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(AR_UPLOADS_DIR)) {
  fs.mkdirSync(AR_UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const mimeOk = allowed.test(file.mimetype);
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  if (mimeOk && extOk) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only JPEG, PNG, and WebP images are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50mb
});

const excelFilter = (_req, file, cb) => {
  const allowed = /xlsx|xls/;
  const mimeOk = /application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet|application\/vnd\.ms-excel/.test(file.mimetype);
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  if (mimeOk && extOk) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only Excel files (.xlsx, .xls) are allowed'));
  }
};

const excelUpload = multer({
  storage,
  fileFilter: excelFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10mb for excel
});

export const uploadSingle = (fieldName) => upload.single(fieldName);
export const uploadMultiple = (fieldName, maxCount = 5) => upload.array(fieldName, maxCount);
export const uploadFields = (fields) => upload.fields(fields);
export const uploadExcel = (fieldName) => excelUpload.single(fieldName);

// AR Model upload — accepts GLB and GLTF files only
const arStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, AR_UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `ar-model-${uniqueSuffix}${ext}`);
  },
});

const arFileFilter = (_req, file, cb) => {
  const allowedMimes = [
    'model/gltf-binary',
    'model/gltf+json',
    'application/octet-stream', // common fallback for .glb
  ];
  const allowedExts = /\.glb|\.gltf/;
  const extOk = allowedExts.test(path.extname(file.originalname).toLowerCase());
  if (extOk) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only GLB and GLTF 3D model files are allowed'));
  }
};

const arUpload = multer({
  storage: arStorage,
  fileFilter: arFileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB for 3D models
});

export const uploadArModel = (fieldName) => arUpload.single(fieldName);
