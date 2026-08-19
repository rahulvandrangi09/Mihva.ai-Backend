import { PrismaClient } from '@prisma/client';
import aiService from '../services/ai-service.js';

const prisma = new PrismaClient();

const chat = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message cannot be empty!' });
        }

        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: { document: true, messages: { orderBy: { createdAt: 'asc' } } }
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        if (session.userId !== req.userId) {
            return res.status(403).json({ error: 'Not authorized for this session' });
        }

        // Save user message
        await prisma.message.create({
            data: {
                sessionId,
                role: 'USER',
                content: message
            }
        });

        const history = session.messages.map(m => ({
            role: m.role === 'USER' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }));

        const result = await aiService.generateRes(message, session.type, session.document?.extractedText, history);

        // Save assistant message
        await prisma.message.create({
            data: {
                sessionId,
                role: 'ASSISTANT',
                content: result
            }
        });

        res.status(200).json({
            message: result,
            userMessage: message
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export { chat };
