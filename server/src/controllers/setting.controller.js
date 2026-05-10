import Setting from '../models/setting.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import fs from 'fs';
import path from 'path';

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
    
    let setting = await Setting.findOne();
    if (!setting) {
        setting = await Setting.create({});
    }

    if (req.files) {
        if (req.files['previewImage'] && req.files['previewImage'][0]) {
            // Delete old preview image if exists and is local
            if (setting.previewImage && !setting.previewImage.startsWith('http')) {
                const oldPath = path.join(process.cwd(), setting.previewImage);
                try {
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                } catch (error) {
                    console.error('Error deleting old preview image:', error);
                }
            }
            data.previewImage = `/uploads/${req.files['previewImage'][0].filename}`;
        }
        if (req.files['logo'] && req.files['logo'][0]) {
            // Delete old logo if exists and is local
            if (setting.logo && !setting.logo.startsWith('http')) {
                const oldPath = path.join(process.cwd(), setting.logo);
                try {
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }
                } catch (error) {
                    console.error('Error deleting old logo:', error);
                }
            }
            data.logo = `/uploads/${req.files['logo'][0].filename}`;
        }
    } else if (req.file) {
        // Fallback for single file
        if (setting.previewImage && !setting.previewImage.startsWith('http')) {
            const oldPath = path.join(process.cwd(), setting.previewImage);
            try {
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            } catch (error) {
                console.error('Error deleting old preview image:', error);
            }
        }
        data.previewImage = `/uploads/${req.file.filename}`;
    }

    const updatedSetting = await Setting.findByIdAndUpdate(setting._id, data, {
        new: true,
        runValidators: true,
    });

    res.status(200).json(new ApiResponse('Settings updated', updatedSetting));
});
