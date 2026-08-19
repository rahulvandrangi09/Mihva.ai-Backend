import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createSession = async (req, res) => {
    try {
        const { type, documentId } = req.body;

        if (!type || !['BODHA', 'ABHYAS', 'VIDYA', 'MIHVA'].includes(type)) {
            return res.status(400).json({ error: 'Invalid or missing session type' });
        }

        if ((type === 'BODHA' || type === 'VIDYA') && !documentId) {
            return res.status(400).json({ error: 'Document ID is required for BODHA and VIDYA sessions' });
        }

        const session = await prisma.session.create({
            data: {
                userId: req.userId,
                type,
                documentId: documentId || null
            }
        });

        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserSessions = async (req, res) => {
    try {
        const sessions = await prisma.session.findMany({
            where: { userId: req.userId },
            include: { document: { select: { fileName: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSessionMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const messages = await prisma.message.findMany({
            where: { sessionId: id, session: { userId: req.userId } },
            orderBy: { createdAt: 'asc' }
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { createSession, getUserSessions, getSessionMessages };
