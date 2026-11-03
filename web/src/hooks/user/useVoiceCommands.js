import { useState, useEffect, useCallback } from 'react';
import { useCart } from '../../context/CartContext';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useNavigate } from 'react-router-dom';

export const useVoiceCommands = (services = [], onServiceFilter = null) => {
  const [feedback, setFeedback] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const { dispatch, cartItems } = useCart();
  const navigate = useNavigate();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Process transcript when it changes
  useEffect(() => {
    if (transcript && transcript !== lastCommand) {
      setLastCommand(transcript);
      processVoiceCommand(transcript);
    }
  }, [transcript]);

  // Enhanced service matching with hierarchy support
  const findServiceMatch = useCallback((commandText) => {
    const text = commandText.toLowerCase();

    // Extract service and sub-service from command
    const serviceKeywords = {
      'dry clean': ['dry', 'clean', 'drycleaning', 'dry cleaning'],
      'steam ironing': ['steam', 'iron', 'ironing', 'press'],
      'separate washing': ['separate', 'wash', 'washing', 'laundry'],
      'normal washing': ['normal', 'regular', 'basic'],
      'premium washing': ['premium', 'deluxe', 'special']
    };

    const subServiceKeywords = {
      'pant': ['pant', 'pants', 'trouser', 'trousers'],
      'shirt': ['shirt', 'shirts', 'top'],
      'coat': ['coat', 'jacket', 'blazer'],
      'dress': ['dress', 'gown', 'frock'],
      'saree': ['saree', 'sari'],
      'kurta': ['kurta', 'kurti']
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

  // Process voice commands
  const processVoiceCommand = useCallback((command) => {
    const text = command.toLowerCase().trim();
    /* console.log("text", text); */

    setFeedback('Processing command...');

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

  // Clear feedback after a delay
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Start listening
  const startListening = () => {
    resetTranscript();
    setFeedback('Listening... Speak now');
    SpeechRecognition.startListening({
      continuous: false,
      language: 'en-IN' // Indian English for better recognition
    });
  };

  // Stop listening
  const stopListening = () => {
    SpeechRecognition.stopListening();
    setFeedback('');
  };

  return {
    isListening: listening,
    transcript,
    feedback,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: browserSupportsSpeechRecognition
  };
};