// OpenAI Service for handling API calls
// Note: In production, these calls should go through your backend for security

import OpenAI from 'openai';

class OpenAIService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: import.meta.env.VITE_OPENAI_API_KEY,
            dangerouslyAllowBrowser: true // Only for development
        });
    }

    // Transcribe audio using Whisper
    async transcribeAudio(audioBlob) {
        try {
            // Create a proper File object with a name and type
            const audioFile = new File([audioBlob], 'recording.webm', {
                type: audioBlob.type || 'audio/webm'
            });

            /* console.log('Transcribing audio file:', {
                name: audioFile.name,
                type: audioFile.type,
                size: audioFile.size
            }); */

            const response = await this.openai.audio.transcriptions.create({
                file: audioFile,
                model: 'whisper-1',
                language: 'en',
                prompt: 'This is a voice command for a laundry app. Commands include adding items to cart, removing items, showing cart, and filtering services like dry cleaning, steam ironing, separate washing.'
            });

            return {
                success: true,
                text: response.text,
                error: null
            };
        } catch (error) {
            /* console.error('Whisper transcription error:', error); */
            return {
                success: false,
                text: '',
                error: error.message
            };
        }
    }

    // Analyze command intent using GPT
    async analyzeCommand(transcript) {
        try {
            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are a voice command processor for a laundry app. Analyze the user's command and respond with a JSON object containing:
            {
              "action": "add_to_cart" | "remove_from_cart" | "show_cart" | "clear_cart" | "filter_services" | "unknown",
              "service": "dry clean" | "steam ironing" | "separate washing" | "normal washing" | "premium washing" | null,
              "item": "pant" | "shirt" | "coat" | "dress" | "saree" | "kurta" | null,
              "confidence": 0.0-1.0,
              "natural_response": "A friendly response to the user"
            }
            
            Available services: dry clean, steam ironing, separate washing, normal washing, premium washing
            Available items: pant, shirt, coat, dress, saree, kurta
            
            Examples:
            "add dry clean pant to cart" -> {"action": "add_to_cart", "service": "dry clean", "item": "pant", "confidence": 0.95, "natural_response": "Adding dry clean pant to your cart"}
            "show steam ironing services" -> {"action": "filter_services", "service": "steam ironing", "item": null, "confidence": 0.9, "natural_response": "Showing steam ironing services"}
            "open cart" -> {"action": "show_cart", "service": null, "item": null, "confidence": 0.95, "natural_response": "Opening your cart"}
            
            Be flexible with variations in speech and synonyms.`
                    },
                    {
                        role: "user",
                        content: transcript
                    }
                ],
                temperature: 0.1,
                max_tokens: 200
            });

            const aiResponse = JSON.parse(completion.choices[0].message.content);

            return {
                success: true,
                analysis: aiResponse,
                error: null
            };
        } catch (error) {
            /* console.error('GPT analysis error:', error); */
            return {
                success: false,
                analysis: null,
                error: error.message
            };
        }
    }

    // Enhanced command processing with context
    async processCommandWithContext(transcript, cartItems = [], availableServices = []) {
        try {
            const serviceNames = availableServices.map(s => s.serv_Name).join(', ');
            const cartItemNames = cartItems.map(item => item.servSubType_Name).join(', ');

            const completion = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are an AI assistant for a laundry app. The user has spoken a command.
            
            Current context:
            - Available services: ${serviceNames || 'Loading...'}
            - Items in cart: ${cartItemNames || 'Empty cart'}
            
            Analyze the command and respond with JSON:
            {
              "action": "add_to_cart" | "remove_from_cart" | "show_cart" | "clear_cart" | "filter_services" | "unknown",
              "service": string | null,
              "item": string | null,
              "confidence": 0.0-1.0,
              "feedback": "User-friendly response message",
              "suggestions": ["alternative command 1", "alternative command 2"]
            }
            
            Be intelligent about matching partial names and handling variations.`
                    },
                    {
                        role: "user",
                        content: transcript
                    }
                ],
                temperature: 0.2,
                max_tokens: 250
            });

            const aiResponse = JSON.parse(completion.choices[0].message.content);

            return {
                success: true,
                result: aiResponse,
                error: null
            };
        } catch (error) {
            /* console.error('Context processing error:', error); */
            return {
                success: false,
                result: null,
                error: error.message
            };
        }
    }
}

// Export singleton instance
export const openaiService = new OpenAIService();
export default openaiService;