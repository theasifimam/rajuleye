import Contact from '../models/contact.model.js';
import Notification from '../models/notification.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { sendEmail } from '../utils/sendEmail.js';

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || 'therajuleye@gmail.com';

// POST /api/v1/contact  (public)
export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    throw new ApiError(400, 'name, email, subject and message are required');
  }

  // Persist the contact message
  const contact = await Contact.create({ name, email, subject, message });

  // Create in-app notification
  await Notification.create({
    type: 'contact',
    title: `New Message: ${subject}`,
    body: `From ${name} <${email}>: ${message.slice(0, 120)}${message.length > 120 ? '…' : ''}`,
    refId: contact._id.toString(),
    refModel: 'Contact',
    meta: { senderName: name, senderEmail: email, subject, message },
  });

  // Send email to admin
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.10); }
        .header { background: #1a1a2e; padding: 32px; text-align: center; }
        .header h1 { color: #e2b96f; margin: 0; font-size: 22px; letter-spacing: 1px; }
        .badge { display: inline-block; background: #e2b96f22; border: 1px solid #e2b96f44; color: #e2b96f; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; border-radius: 100px; padding: 4px 16px; margin-top: 12px; }
        .body { padding: 36px 32px; }
        .body h2 { color: #1a1a2e; margin-top: 0; font-size: 18px; }
        .field { margin-bottom: 20px; }
        .field label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #888; margin-bottom: 6px; }
        .field p { margin: 0; color: #333; font-size: 14px; line-height: 1.6; background: #f9f9f9; border-radius: 8px; padding: 12px 16px; border-left: 3px solid #e2b96f; }
        .reply-btn { display: inline-block; margin-top: 24px; background: #1a1a2e; color: #e2b96f; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 700; font-size: 13px; letter-spacing: 1px; }
        .footer { background: #f9f9f9; padding: 16px 32px; text-align: center; color: #aaa; font-size: 12px; border-top: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>👓 Rajul Eye</h1>
          <span class="badge">New Contact Message</span>
        </div>
        <div class="body">
          <h2>You have a new message from your website</h2>
          <div class="field">
            <label>From</label>
            <p>${name} &lt;${email}&gt;</p>
          </div>
          <div class="field">
            <label>Subject</label>
            <p>${subject}</p>
          </div>
          <div class="field">
            <label>Message</label>
            <p>${message.replace(/\n/g, '<br/>')}</p>
          </div>
          <a class="reply-btn" href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}&body=Hi ${encodeURIComponent(name)},%0A%0A">
            ↩ Reply to ${name}
          </a>
        </div>
        <div class="footer">© ${new Date().getFullYear()} Rajul Eye. All rights reserved.</div>
      </div>
    </body>
    </html>
  `;

  // Fire email without blocking the response
  sendEmail({
    to: ADMIN_EMAIL,
    subject: `[Contact] ${subject} — from ${name}`,
    html,
  }).catch(() => { /* non-critical */ });

  res.status(201).json(new ApiResponse('Message sent successfully', { id: contact._id }));
});

// GET /api/v1/contact  (admin)
export const getContacts = asyncHandler(async (req, res) => {
  const { page = '1', limit = '20' } = req.query;
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;

  const [contacts, total] = await Promise.all([
    Contact.find().sort('-createdAt').skip(skip).limit(limitNum),
    Contact.countDocuments(),
  ]);

  res.status(200).json(
    new ApiResponse('Contact messages fetched', {
      contacts,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    })
  );
});
