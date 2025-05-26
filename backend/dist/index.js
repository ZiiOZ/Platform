"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const openai_1 = __importDefault(require("openai"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
app.post('/generate-tags', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { input } = req.body;
    if (!input)
        return res.status(400).json({ error: 'Missing input' });
    try {
        const response = yield openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'system', content: 'Generate 5 short, relevant, comma-separated tags for videos.' },
                { role: 'user', content: `Title: ${input}` },
            ],
            temperature: 0.7,
        });
        const raw = (_b = (_a = response.choices[0].message) === null || _a === void 0 ? void 0 : _a.content) !== null && _b !== void 0 ? _b : '';
        const tags = raw.split(',').map(tag => tag.trim().replace(/^#/, '')).filter(Boolean);
        res.json({ tags });
    }
    catch (err) {
        console.error('Tag generation error:', err);
        res.status(500).json({ error: 'Failed to generate tags' });
    }
}));
app.get('/', (_, res) => {
    res.send('ZiiOZ Backend API is live 🚀');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`ZiiOZ backend running on port ${PORT}`);
});
