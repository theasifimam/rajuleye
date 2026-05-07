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
    
    if (req.file) {
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
