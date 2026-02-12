import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const { name, email, message } = req.body;

	if (!name || !name.trim()) {
		return res.status(400).json({ error: 'Name is required' });
	}

	if (!email || !email.includes('@')) {
		return res.status(400).json({ error: 'Valid email is required' });
	}

	if (!message || !message.trim()) {
		return res.status(400).json({ error: 'Message is required' });
	}

	try {
		await resend.emails.send({
			from: 'Contact Form <onboarding@resend.dev>',
			to: 'ether-strannik@proton.me',
			replyTo: email,
			subject: `Contact: ${name}`,
			text: `Name: ${name}\nEmail: ${email}\n\n${message}`
		});

		return res.status(200).json({ message: 'Message sent' });
	} catch (error) {
		console.error('Resend error:', error);
		return res.status(500).json({ error: 'Failed to send message' });
	}
}
