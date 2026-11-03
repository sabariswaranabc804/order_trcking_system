import { useState, useCallback, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
});

export const useOpenAIVoiceCommands = (services = [], onServiceFilter = null) => {
    const [isRecording, setIsRecording] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [transcript, setTranscript] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const { dispatch, cartItems } = useCart();
    const navigate = useNavigate();

    // Dynamic service matching - works with ANY service from your database
    const findServiceMatch = useCallback((commandText) => {
        const text = commandText.toLowerCase();
        /* console.log('🔍 Searching in text:', text); */

        // Generate dynamic keywords from your actual services
        const generateServiceKeywords = (serviceName) => {
            const name = serviceName.toLowerCase();
            const words = name.split(' ');
            const keywords = [
                name, // full name
                name.replace(/\s+/g, ''), // no spaces
                ...words, // individual words
                ...words.map(word => word.substring(0, 4)) // partial words
            ];
            return [...new Set(keywords)]; // remove duplicates
        };

        const generateSubServiceKeywords = (subServiceName) => {
            const name = subServiceName.toLowerCase();
            const words = name.split(' ');
            const keywords = [
                name, // full name
                name.replace(/\s+/g, ''), // no spaces
                ...words, // individual words
            ];
            return [...new Set(keywords)];
        };

        // Get unique service names from your services array
        const uniqueServices = [...new Set(services.map(s => s.serv_Name))];
        const uniqueSubServices = [...new Set(services.map(s => s.servSubType_Name))];

        /* console.log('🏷️ Available services:', uniqueServices); */
        /* console.log('🏷️ Available sub-services:', uniqueSubServices); */

        let matchedService = null;
        let matchedSubService = null;
        let matchedServiceName = '';
        let matchedSubServiceName = '';

        // Dynamic service matching
        for (const serviceName of uniqueServices) {
            if (!serviceName) continue;
            
            const keywords = generateServiceKeywords(serviceName);
            /* console.log(`🔍 Checking service "${serviceName}" with keywords:`, keywords); */
            
            if (keywords.some(keyword => keyword.length > 2 && text.includes(keyword))) {
                matchedService = serviceName;
                matchedServiceName = serviceName.toLowerCase();
                /* console.log('✅ Matched service:', serviceName); */
                break;
            }
        }

        // Dynamic sub-service matching
        for (const subServiceName of uniqueSubServices) {
            if (!subServiceName) continue;
            
            const keywords = generateSubServiceKeywords(subServiceName);
            /* console.log(`🔍 Checking sub-service "${subServiceName}" with keywords:`, keywords); */
            
            if (keywords.some(keyword => keyword.length > 2 && text.includes(keyword))) {
                matchedSubService = subServiceName;
                matchedSubServiceName = subServiceName.toLowerCase();
                /* console.log('✅ Matched sub-service:', subServiceName); */
                break;
            }
        }

        // Find exact service from services array - DYNAMIC MATCHING
        let exactService = null;

        /* console.log('🎯 Looking for matches - Service:', matchedService, 'Sub-service:', matchedSubService); */

        if (matchedService && matchedSubService) {
            // Both service and sub-service matched
            exactService = services.find(service => {
                const serviceName = service.serv_Name?.toLowerCase() || '';
                const subServiceName = service.servSubType_Name?.toLowerCase() || '';
                
                const serviceMatch = serviceName.includes(matchedServiceName) || 
                                   matchedServiceName.includes(serviceName);
                const subServiceMatch = subServiceName.includes(matchedSubServiceName) || 
                                       matchedSubServiceName.includes(subServiceName);
                
                return serviceMatch && subServiceMatch;
            });
            /* console.log('🎯 Both matched, found:', exactService?.servSubType_Name); */
            
        } else if (matchedService) {
            // Only service matched - find any sub-service under this service
            exactService = services.find(service => {
                const serviceName = service.serv_Name?.toLowerCase() || '';
                return serviceName.includes(matchedServiceName) || 
                       matchedServiceName.includes(serviceName);
            });
            /* console.log('🎯 Service only matched, found:', exactService?.servSubType_Name); */
            
        } else if (matchedSubService) {
            // Only sub-service matched - find it in any service
            exactService = services.find(service => {
                const subServiceName = service.servSubType_Name?.toLowerCase() || '';
                return subServiceName.includes(matchedSubServiceName) || 
                       matchedSubServiceName.includes(subServiceName);
            });
            /* console.log('🎯 Sub-service only matched, found:', exactService?.servSubType_Name); */
            
        } else {
            // No keyword match - try fuzzy matching with the original text
            exactService = services.find(service => {
                const serviceName = service.serv_Name?.toLowerCase() || '';
                const subServiceName = service.servSubType_Name?.toLowerCase() || '';
                
                // Check if any words from the command appear in service names
                const textWords = text.split(' ').filter(word => word.length > 2);
                return textWords.some(word => 
                    serviceName.includes(word) || subServiceName.includes(word)
                );
            });
            /* console.log('🎯 Fuzzy match found:', exactService?.servSubType_Name); */
        }

        // Find all possible matches for suggestions
        const allMatches = services.filter(service => {
            const serviceName = service.serv_Name?.toLowerCase() || '';
            const subServiceName = service.servSubType_Name?.toLowerCase() || '';
            
            if (matchedService && matchedSubService) {
                return (serviceName.includes(matchedServiceName) || matchedServiceName.includes(serviceName)) ||
                       (subServiceName.includes(matchedSubServiceName) || matchedSubServiceName.includes(subServiceName));
            } else if (matchedService) {
                return serviceName.includes(matchedServiceName) || matchedServiceName.includes(serviceName);
            } else if (matchedSubService) {
                return subServiceName.includes(matchedSubServiceName) || matchedSubServiceName.includes(subServiceName);
            }
            return false;
        });

        /* console.log('🎯 Final result:', {
            exactService: exactService?.servSubType_Name,
            allMatchesCount: allMatches.length,
            matchedService,
            matchedSubService
        }); */

        return {
            service: exactService,
            matchedService,
            matchedSubService,
            allMatches
        };
    }, [services]);

    // Process voice commands using OpenAI's understanding
    const processVoiceCommand = useCallback(async (command) => {
        const text = command.toLowerCase().trim();
        setFeedback('Processing command...');
        setTranscript(command);

        // Debug: Log what we're processing
        /* console.log('🎤 Voice Command:', command); */
        /* console.log('🔍 Normalized text:', text); */

        try {
            // Generate dynamic lists from your actual services
            const uniqueServices = [...new Set(services.map(s => s.serv_Name))].filter(Boolean);
            const uniqueSubServices = [...new Set(services.map(s => s.servSubType_Name))].filter(Boolean);
            
            /* console.log('🤖 Sending to AI - Services:', uniqueServices); */
            /* console.log('🤖 Sending to AI - Items:', uniqueSubServices); */

            // Use OpenAI to better understand the intent with DYNAMIC data
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are a voice command processor for a laundry app. Analyze the user's command and respond with a JSON object containing:
            {
              "action": "add_to_cart" | "remove_from_cart" | "show_cart" | "clear_cart" | "filter_services" | "unknown",
              "service": string | null,
              "item": string | null,
              "confidence": 0.0-1.0
            }
            
            DYNAMIC DATA FROM DATABASE:
            Available services: ${uniqueServices.join(', ')}
            Available items: ${uniqueSubServices.join(', ')}
            
            IMPORTANT: 
            - Use the EXACT service and item names from the lists above
            - Be flexible with variations and partial matches
            - If user says something close to a service/item name, match it to the closest one
            
            Examples:
            "add ${uniqueServices[0] || 'dry clean'} ${uniqueSubServices[0] || 'pant'} to cart" -> {"action": "add_to_cart", "service": "${uniqueServices[0] || 'dry clean'}", "item": "${uniqueSubServices[0] || 'pant'}", "confidence": 0.95}
            "show ${uniqueServices[0] || 'dry clean'} services" -> {"action": "filter_services", "service": "${uniqueServices[0] || 'dry clean'}", "item": null, "confidence": 0.9}
            "open cart" -> {"action": "show_cart", "service": null, "item": null, "confidence": 0.95}`
                    },
                    {
                        role: "user",
                        content: command
                    }
                ],
                temperature: 0.1,
                max_tokens: 150
            });

            const aiResponse = JSON.parse(completion.choices[0].message.content);

            // Debug: Log AI understanding
            /* console.log('🤖 AI Response:', aiResponse); */

            // Execute the action based on AI understanding
            switch (aiResponse.action) {
                case 'add_to_cart':
                    await handleAddToCart(aiResponse);
                    break;

                case 'remove_from_cart':
                    await handleRemoveFromCart(aiResponse);
                    break;

                case 'show_cart':
                    navigate('/cart-category');
                    setFeedback(`Opening cart with ${cartItems.length} items`);
                    break;

                case 'clear_cart':
                    dispatch({ type: 'RESET_CART' });
                    setFeedback('Cart cleared');
                    break;

                case 'filter_services':
                    await handleFilterServices(aiResponse);
                    break;

                default:
                    setFeedback('Command not recognized. Try "add dry clean pant to cart"');
            }

        } catch (error) {
            /* console.error('OpenAI processing error:', error); */
            // Fallback to basic text processing
            await fallbackProcessing(text);
        }
    }, [services, cartItems, dispatch, navigate, onServiceFilter]);

    // Handle add to cart with AI understanding
    const handleAddToCart = async (aiResponse) => {
        const searchText = `${aiResponse.service || ''} ${aiResponse.item || ''}`;
        /* console.log('🔍 Searching for:', searchText); */

        const match = findServiceMatch(searchText);
        /* console.log('✅ Match found:', match); */

        if (match.service) {
            dispatch({
                type: 'ADD_TO_CART',
                payload: match.service
            });
            setFeedback(`Added ${match.service.servSubType_Name} to cart`);
        } else if (match.allMatches.length > 1) {
            if (onServiceFilter && match.matchedService) {
                onServiceFilter(match.matchedService);
                setFeedback(`Showing ${match.matchedService} services`);
            } else {
                setFeedback(`Found ${match.allMatches.length} matching services`);
            }
        } else {
            setFeedback(`Service "${aiResponse.service} ${aiResponse.item}" not found`);
        }
    };

    // Handle remove from cart
    const handleRemoveFromCart = async (aiResponse) => {
        const match = findServiceMatch(`${aiResponse.service || ''} ${aiResponse.item || ''}`);
        const cartItem = cartItems.find(item =>
            item.servSubType_Id === match.service?.servSubType_Id
        );

        if (cartItem) {
            dispatch({
                type: 'REMOVE_FROM_CART_SUCCESS',
                payload: { id: cartItem.servSubType_Id }
            });
            setFeedback(`Removed ${cartItem.servSubType_Name} from cart`);
        } else {
            setFeedback('Item not found in cart');
        }
    };

    // Handle filter services
    const handleFilterServices = async (aiResponse) => {
        if (aiResponse.service && onServiceFilter) {
            onServiceFilter(aiResponse.service);
            setFeedback(`Filtering ${aiResponse.service} services`);
        } else {
            setFeedback('Please specify a service to filter');
        }
    };

    // Fallback processing if OpenAI fails
    const fallbackProcessing = async (text) => {
        // Basic keyword matching as fallback
        if (text.includes('add') && text.includes('cart')) {
            const match = findServiceMatch(text);
            if (match.service) {
                dispatch({ type: 'ADD_TO_CART', payload: match.service });
                setFeedback(`Added ${match.service.servSubType_Name} to cart`);
            }
        } else if ((text.includes('show') && text.includes('cart')) ||
            (text.includes('open') && text.includes('cart'))) {
            navigate('/cart-category');
            setFeedback(`Opening cart with ${cartItems.length} items`);
        } else {
            setFeedback('Command not recognized');
        }
    };

    // Convert audio to text using OpenAI Whisper
    const transcribeAudio = async (audioBlob) => {
        try {
            setIsProcessing(true);
            setFeedback('Converting speech to text...');

            // Create a proper File object from the blob
            const audioFile = new File([audioBlob], 'recording.webm', {
                type: 'audio/webm'
            });

            const response = await openai.audio.transcriptions.create({
                file: audioFile,
                model: 'whisper-1',
                language: 'en',
                prompt: 'This is a voice command for a laundry app. Commands include adding items to cart, removing items, showing cart, and filtering services like dry cleaning, steam ironing, separate washing.'
            });

            const transcribedText = response.text;

            if (transcribedText.trim()) {
                await processVoiceCommand(transcribedText);
            } else {
                setFeedback('No speech detected. Please try again.');
            }

        } catch (error) {
            /* console.error('Transcription error:', error); */
            setFeedback('Error processing audio. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Start recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true
                }
            });

            // Try different MIME types for better compatibility
            let mimeType = 'audio/webm;codecs=opus';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'audio/webm';
            }
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'audio/mp4';
            }
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = ''; // Let browser choose
            }

            const options = mimeType ? { mimeType } : {};
            mediaRecorderRef.current = new MediaRecorder(stream, options);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: mimeType || 'audio/webm'
                });

                // Check if we have audio data
                if (audioBlob.size > 0) {
                    await transcribeAudio(audioBlob);
                } else {
                    setFeedback('No audio recorded. Please try again.');
                    setIsProcessing(false);
                }

                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.onerror = (event) => {
                /* console.error('MediaRecorder error:', event.error); */
                setFeedback('Recording error. Please try again.');
                setIsRecording(false);
                setIsProcessing(false);
            };

            mediaRecorderRef.current.start(1000); // Record in 1-second chunks
            setIsRecording(true);
            setFeedback('🎤 Recording... Speak now');

        } catch (error) {
            /* console.error('Recording error:', error); */
            setFeedback('Microphone access denied. Please allow microphone access.');
        }
    };

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setFeedback('Processing...');
        }
    };

    // Clear feedback after delay
    useState(() => {
        if (feedback && !isRecording && !isProcessing) {
            const timer = setTimeout(() => {
                setFeedback('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [feedback, isRecording, isProcessing]);

    return {
        isRecording,
        isProcessing,
        transcript,
        feedback,
        startRecording,
        stopRecording,
        isSupported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    };
};