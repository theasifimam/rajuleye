import Subscriber from '../models/subscriber.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { sendEmail } from '../utils/sendEmail.js';

// POST /api/v1/subscribers/subscribe
export const subscribe = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, 'Email is required');
    }

    const existingSubscriber = await Subscriber.findOne({ email });

    if (existingSubscriber) {
        if (!existingSubscriber.isActive) {
            existingSubscriber.isActive = true;
            await existingSubscriber.save();
            res.status(200).json(new ApiResponse('Successfully re-subscribed to the newsletter', existingSubscriber));
            return;
        }
        throw new ApiError(409, 'Email is already subscribed');
    }

    const newSubscriber = await Subscriber.create({ email });

    res.status(201).json(new ApiResponse('Successfully subscribed to the newsletter', newSubscriber));
});

// GET /api/v1/subscribers
// Protected (Admin only)
export const getSubscribers = asyncHandler(async (req, res) => {
    const subscribers = await Subscriber.find({}).sort('-createdAt');
    res.status(200).json(new ApiResponse('Subscribers fetched successfully', subscribers));
});

// POST /api/v1/subscribers/send
// Protected (Admin only)
export const sendNewsletter = asyncHandler(async (req, res) => {
    const { subject, message } = req.body;

    if (!subject || !message) {
        throw new ApiError(400, 'Subject and message are required');
    }

    const activeSubscribers = await Subscriber.find({ isActive: true });

    if (activeSubscribers.length === 0) {
        throw new ApiError(404, 'No active subscribers found');
    }

    const emailPromises = activeSubscribers.map(sub => {
        // Basic HTML envelope for the newsletter
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Inter', sans-serif; background: #050505; color: #fff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #111; border: 1px solid #333; overflow: hidden; }
          .header { background: #000; padding: 32px; text-align: center; border-bottom: 1px solid #222; }
          .header h1 { color: #fff; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; }
          .body { padding: 40px 32px; line-height: 1.6; color: #ccc; }
          .footer { background: #000; padding: 24px 32px; text-align: center; color: #666; font-size: 11px; border-top: 1px solid #222; text-transform: uppercase; letter-spacing: 1px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Rajul Eye</h1></div>
          <div class="body">
            ${message}
          </div>
          <div class="footer">
            © ${new Date().getFullYear()} RAJUL EYE SIGNATURE OPTICS / ALL CALIBRATIONS RESERVED.<br/>
            You are receiving this email because you subscribed to Archive Access.
          </div>
        </div>
      </body>
      </html>
    `;

        return sendEmail({
            to: sub.email,
            subject,
            html
        });
    });

    await Promise.allSettled(emailPromises);

    res.status(200).json(new ApiResponse('Newsletter dispatch initiated successfully', { totalSent: emailPromises.length }));
});
