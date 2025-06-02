"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // ✅ Must come FIRST
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ziibot_reply_1 = __importDefault(require("./api/ziibot-reply"));
const ai_post_enhance_1 = __importDefault(require("./api/ai-post-enhance"));
const comments_api_1 = __importDefault(require("./api/comments.api"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/api', ziibot_reply_1.default);
app.use('/api', ai_post_enhance_1.default);
app.use('/api', comments_api_1.default);
app.get('/', (_req, res) => {
    res.send('ZiiOZ Backend is Live');
});
app.listen(PORT, () => {
    console.log('[ZiiBot] OpenAI Key Loaded:', Boolean(process.env.OPENAI_API_KEY));
    console.log(`ZiiOZ backend running on port ${PORT}`);
});
