import { useState, useCallback, useRef } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

// Simple voice commands without OpenAI (fallback option)
export const useSimpleVoiceCommands = (services = [], onServiceFilter = null) => {
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  
  const { dispatch, cartItems } = useCart();
  const navigate = useNavigate();

  // Enhanced service matching with hierarchy support
  const findServiceMatch = useCallback((commandText) => {
    const text = commandText.toLowerCase();
    
    // Extract service and sub-service from command
    const serviceKeywords = {
      'dry clean': ['dry', 'clean', 'drycleaning', 'dry cleaning', 'dryclean'],
      'steam ironing': ['steam', 'iron', 'ironing', 'press', 'steaming'],
      'separate washing': ['separate', 'wash', 'washing', 'laundry', 'separating'],
      'normal washing': ['normal', 'regular', 'basic', 'standard'],
      'premium washing': ['premium', 'deluxe', 'special', 'luxury']
    };

    const subServiceKeywords = {
      'pant': ['pant', 'pants', 'trouser', 'trousers'],
      'shirt': ['shirt', 'shirts', 'top', 'blouse'],
      'coat': ['coat', 'jacket', 'blazer', 'suit'],
      'dress': ['dress', 'gown', 'frock'],
      'saree': ['saree', 'sari', 'sarees'],
      'kurta': ['kurta', 'kurti', 'kurtas'],
      'silk towel': ['silk towel', 'silktowel', 'silk', 'towel'],
      'towel': ['towel', 'towels', 'bath towel', 'hand towel'],
      'bedsheet': ['bedsheet', 'bed sheet', 'sheet', 'sheets'],
      'blanket': ['blanket', 'blankets', 'comforter'],
      'pillow': ['pillow', 'pillows', 'pillow cover'],
      'curtain': ['curtain', 'curtains', 'drapes']
    };

    let matchedService = null;
    let matchedSubService = null;

    // Find service match
    for (const [serviceName, keywords] of Object.entries(serviceKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        matchedService = serviceName;
        break;
      }
    }

    // Find sub-service match
    for (const [subServiceName, keywords] of Object.entries(subServiceKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        matchedSubService = subServiceName;
        break;
      }
    }

    // Find exact service from services array
    let exactService = null;
    
    if (matchedService && matchedSubService) {
      // Look for exact match with both service and sub-service
      exactService = services.find(service => {
        const serviceName = service.serv_Name?.toLowerCase();
        const subServiceName = service.servSubType_Name?.toLowerCase();
        
        return serviceName?.includes(matchedService.toLowerCase()) && 
               subServiceName?.includes(matchedSubService.toLowerCase());
      });
    } else if (matchedService) {
      // Look for service match only
      exactService = services.find(service => {
        const serviceName = service.serv_Name?.toLowerCase();
        return serviceName?.includes(matchedService.toLowerCase());
      });
    } else if (matchedSubService) {
      // Look for sub-service match only
      exactService = services.find(service => {
        const subServiceName = service.servSubType_Name?.toLowerCase();
        return subServiceName?.includes(matchedSubService.toLowerCase());
      });
    }

    return {
      service: exactService,
      matchedService,
      matchedSubService,
      allMatches: services.filter(service => {
        const serviceName = service.serv_Name?.toLowerCase();
        const subServiceName = service.servSubType_Name?.toLowerCase();
        
        return (matchedService && serviceName?.includes(matchedService.toLowerCase())) ||
               (matchedSubService && subServiceName?.includes(matchedSubService.toLowerCase()));
      })
    };
  }, [services]);

  // Simple text-based command processing
  const processVoiceCommand = useCallback((command) => {
    const text = command.toLowerCase().trim();
    setFeedback('Processing command...');
    setTranscript(command);

    // Add to cart commands
    if (text.includes('add') && text.includes('cart')) {
      const match = findServiceMatch(text);
      
      if (match.service) {
        dispatch({
          type: 'ADD_TO_CART',
          payload: match.service
        });
        setFeedback(`Added ${match.service.servSubType_Name} to cart`);
      } else if (match.allMatches.length > 1) {
        // Multiple matches - filter services
        if (onServiceFilter && match.matchedService) {
          onServiceFilter(match.matchedService);
          setFeedback(`Showing ${match.matchedService} services`);
        } else {
          setFeedback(`Found ${match.allMatches.length} matching services`);
        }
      } else {
        setFeedback('Service not found. Try being more specific.');
      }
    }
    // Remove from cart commands
    else if (text.includes('remove') && text.includes('cart')) {
      const match = findServiceMatch(text);
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
    }
    // Show cart commands
    else if ((text.includes('show') && text.includes('cart')) || 
             (text.includes('open') && text.includes('cart'))) {
      navigate('/cart-category');
      setFeedback(`Opening cart with ${cartItems.length} items`);
    }
    // Clear cart commands
    else if (text.includes('clear') && text.includes('cart')) {
      dispatch({ type: 'RESET_CART' });
      setFeedback('Cart cleared');
    }
    // Filter/search commands
    else if (text.includes('show') || text.includes('filter') || text.includes('search')) {
      const match = findServiceMatch(text);
      
      if (match.matchedService && onServiceFilter) {
        onServiceFilter(match.matchedService);
        setFeedback(`Filtering ${match.matchedService} services`);
      } else {
        setFeedback('Please specify a service to filter');
      }
    }
    else {
      setFeedback('Command not recognized. Try "add dry clean pant to cart"');
    }
  }, [services, cartItems, dispatch, navigate, onServiceFilter, findServiceMatch]);

  // Use browser's built-in speech recognition as fallback
  const transcribeAudio = async (audioBlob) => {
    try {
      setIsProcessing(true);
      setFeedback('Processing audio...');

      // For now, we'll use a simple approach
      // In a real implementation, you could send this to your backend
      // or use a different speech-to-text service
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll show a message
      setFeedback('Please use browser speech recognition or add OpenAI API key');
      
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
      
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
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
        
        if (audioBlob.size > 0) {
          await transcribeAudio(audioBlob);
        } else {
          setFeedback('No audio recorded. Please try again.');
          setIsProcessing(false);
        }
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start(1000);
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