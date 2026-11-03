// Voice command patterns and processing utilities
export class VoiceCommandProcessor {
  constructor(services = [], cartItems = []) {
    this.services = services;
    this.cartItems = cartItems;
    
    // Command patterns
    this.patterns = {
      add: /(?:add|put|place)\s+(.+?)\s+(?:to|in|into)\s+(?:my\s+)?cart/i,
      remove: /(?:remove|delete|take\s+out)\s+(.+?)\s+(?:from|out\s+of)\s+(?:my\s+)?cart/i,
      show: /(?:show|display|view|open)\s+(?:my\s+)?cart/i,
      clear: /(?:clear|empty|reset)\s+(?:my\s+)?cart/i,
      quantity: /(?:change|set|update)\s+(.+?)\s+(?:quantity|amount)\s+(?:to|as)\s+(\d+)/i,
      search: /(?:search|find|look\s+for)\s+(.+)/i
    };
  }

  // Process voice command and return action object
  processCommand(transcript) {
    const command = transcript.toLowerCase().trim();
      /* console.log("commad",command); */
    // Try to match against patterns
    for (const [action, pattern] of Object.entries(this.patterns)) {
      const match = command.match(pattern);
      /* console.log("match",match); */
      
      if (match) {
        return this.createAction(action, match, command);
      }
    }
    
    // If no pattern matches, try fuzzy matching
    return this.fuzzyMatch(command);
  }

  // Create action object based on matched pattern
  createAction(actionType, match, originalCommand) {
    /* console.log("ac,ma,o",actionType,match,originalCommand); */
    
    switch (actionType) {
      case 'add':
        const serviceToAdd = this.findService(match[1]);
        return {
          type: 'ADD_TO_CART',
          service: serviceToAdd,
          serviceName: match[1],
          success: !!serviceToAdd,
          message: serviceToAdd 
            ? `Added ${serviceToAdd.servSubType_Name} to cart`
            : `Service "${match[1]}" not found`
        };

      case 'remove':
        const serviceToRemove = this.findCartItem(match[1]);
        return {
          type: 'REMOVE_FROM_CART',
          service: serviceToRemove,
          serviceName: match[1],
          success: !!serviceToRemove,
          message: serviceToRemove 
            ? `Removed ${serviceToRemove.servSubType_Name} from cart`
            : `Item "${match[1]}" not found in cart`
        };

      case 'show':
        return {
          type: 'SHOW_CART',
          success: true,
          message: this.cartItems.length === 0 
            ? 'Your cart is empty' 
            : `You have ${this.cartItems.length} items in your cart`
        };

      case 'clear':
        return {
          type: 'CLEAR_CART',
          success: true,
          message: 'Cart cleared'
        };

      case 'quantity':
        const serviceToUpdate = this.findCartItem(match[1]);
        const quantity = parseInt(match[2]);
        return {
          type: 'UPDATE_QUANTITY',
          service: serviceToUpdate,
          quantity: quantity,
          serviceName: match[1],
          success: !!serviceToUpdate && quantity > 0,
          message: serviceToUpdate 
            ? `Updated ${serviceToUpdate.servSubType_Name} quantity to ${quantity}`
            : `Item "${match[1]}" not found in cart`
        };

      case 'search':
        const searchResults = this.searchServices(match[1]);
        return {
          type: 'SEARCH',
          results: searchResults,
          query: match[1],
          success: searchResults.length > 0,
          message: searchResults.length > 0 
            ? `Found ${searchResults.length} services matching "${match[1]}"`
            : `No services found matching "${match[1]}"`
        };

      default:
        return {
          type: 'UNKNOWN',
          success: false,
          message: 'Command not recognized'
        };
    }
  }

  // Fuzzy matching for commands that don't match patterns
  fuzzyMatch(command) {
    // Simple keyword-based matching
    if (command.includes('cart')) {
      if (command.includes('add') || command.includes('put')) {
        return { type: 'ADD_HELP', message: 'Try saying "Add [service name] to cart"' };
      }
      if (command.includes('remove') || command.includes('delete')) {
        return { type: 'REMOVE_HELP', message: 'Try saying "Remove [service name] from cart"' };
      }
      if (command.includes('show') || command.includes('view')) {
        return { type: 'SHOW_CART', success: true, message: 'Showing cart' };
      }
    }
    
    return {
      type: 'HELP',
      success: false,
      message: 'Try commands like: "Add dry cleaning to cart", "Show my cart", "Remove shirt from cart"'
    };
  }

  // Find service by name with fuzzy matching
  findService(serviceName) {
    const name = serviceName.toLowerCase().trim();
    
    // Exact match first
    let service = this.services.find(s => 
      s.servSubType_Name?.toLowerCase() === name ||
      s.serv_Name?.toLowerCase() === name
    );
    
    if (service) return service;
    
    // Partial match
    service = this.services.find(s => 
      s.servSubType_Name?.toLowerCase().includes(name) ||
      s.serv_Name?.toLowerCase().includes(name) ||
      name.includes(s.servSubType_Name?.toLowerCase()) ||
      name.includes(s.serv_Name?.toLowerCase())
    );
    
    return service;
  }

  // Find item in cart
  findCartItem(serviceName) {
    const name = serviceName.toLowerCase().trim();
    
    return this.cartItems.find(item => 
      item.servSubType_Name?.toLowerCase().includes(name) ||
      item.serv_Name?.toLowerCase().includes(name) ||
      name.includes(item.servSubType_Name?.toLowerCase()) ||
      name.includes(item.serv_Name?.toLowerCase())
    );
  }

  // Search services
  searchServices(query) {
    const searchTerm = query.toLowerCase().trim();
    
    return this.services.filter(service => 
      service.servSubType_Name?.toLowerCase().includes(searchTerm) ||
      service.serv_Name?.toLowerCase().includes(searchTerm)
    );
  }

  // Update services and cart items
  updateData(services, cartItems) {
    this.services = services;
    this.cartItems = cartItems;
  }
}

// Common voice command examples
export const VOICE_COMMAND_EXAMPLES = [
  "Add dry cleaning to cart",
  "Add shirt washing to cart", 
  "Remove pants from cart",
  "Show my cart",
  "Clear cart",
  "Search for laundry services",
  "Change shirt quantity to 3"
];

// Voice feedback messages
export const VOICE_FEEDBACK = {
  LISTENING: "Listening for your command...",
  PROCESSING: "Processing your request...",
  SUCCESS: "Command executed successfully",
  ERROR: "Sorry, I didn't understand that command",
  NO_SPEECH: "No speech detected, please try again",
  NETWORK_ERROR: "Network error, please check your connection"
};