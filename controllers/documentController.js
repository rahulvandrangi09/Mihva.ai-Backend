import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const prisma = new PrismaClient();

const extractText = async (filePath, mimeType, originalname) => {
    try {
        if (mimeType === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            return data.text;
        } else if (mimeType === 'text/plain') {
            return fs.readFileSync(filePath, 'utf8');
        } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || (originalname && originalname.endsWith('.docx'))) {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        } else {
            throw new Error('Unsupported file type. Please upload PDF, DOCX, or TXT files.');
        }
    } catch (error) {
        throw new Error(`Failed to parse file: ${error.message}`);
    }
};

const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { originalname, path, mimetype } = req.file;

        const extractedText = await extractText(path, mimetype, originalname);

        const document = await prisma.document.create({
            data: {
                userId: req.userId,
                fileName: originalname,
                extractedText
            }
        });

        // Cleanup temporary file
        fs.unlinkSync(path);

        res.status(201).json(document);
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getUserDocuments = async (req, res) => {
    try {
        const documents = await prisma.document.findMany({
            where: { userId: req.userId },
            select: { id: true, fileName: true, createdAt: true }
        });
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { uploadDocument, getUserDocuments };
