import { Response } from 'express';
import { body, validationResult } from 'express-validator';

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

// Contact form submission
export const sendContactMessage = async (req: any, res: Response): Promise<void> => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { name, email, message } = req.body;

    // In a production environment, you would:
    // 1. Send an email using a service like SendGrid, Mailgun, or AWS SES
    // 2. Store the message in a database for tracking
    // 3. Send a notification to the support team
    
    // For now, we'll log it and return success
    console.log('Contact form submission:', {
      name,
      email,
      message,
      timestamp: new Date().toISOString(),
    });

    // TODO: Integrate with email service
    // Example: await emailService.sendContactEmail({ name, email, message });

    res.json({
      success: true,
      message: 'Your message has been received. We will get back to you soon!',
    });
  } catch (error: any) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error sending message',
    });
  }
};

