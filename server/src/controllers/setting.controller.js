import Setting from '../models/setting.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';

// GET /api/v1/settings
export const getSetting = asyncHandler(async (req, res) => {
    let setting = await Setting.findOne();
    if (!setting) {
        setting = await Setting.create({});
    }
    res.status(200).json(new ApiResponse('Settings fetched successfully', setting));
});

// PUT /api/v1/settings (admin)
export const updateSetting = asyncHandler(async (req, res) => {
    const data = { ...req.body };
    
    if (req.files) {
        if (req.files['previewImage'] && req.files['previewImage'][0]) {
            data.previewImage = `/uploads/${req.files['previewImage'][0].filename}`;
        }
        if (req.files['logo'] && req.files['logo'][0]) {
            data.logo = `/uploads/${req.files['logo'][0].filename}`;
        }
    } else if (req.file) {
        data.previewImage = `/uploads/${req.file.filename}`;
    }

    let setting = await Setting.findOne();
    if (!setting) {
        setting = await Setting.create({});
    }

    const updatedSetting = await Setting.findByIdAndUpdate(setting._id, data, {
        new: true,
        runValidators: true,
    });

    res.status(200).json(new ApiResponse('Settings updated', updatedSetting));
});
