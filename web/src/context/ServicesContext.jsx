
// // src/context/ServiceContext.js
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';
// import API_URL from '../config';

// // Create the context
// const ServiceContext = createContext();

// // Custom hook to use the ServiceContext
// export const useService = () => {
//     return useContext(ServiceContext);
// };

// // Service Provider to wrap around your application
// export const ServiceProvider = ({ children }) => {
//     const [service, setService] = useState([]);

//     useEffect(() => {
//         const fetchServices = async () => {
//             try {
//                 const response = await axios.get(`${API_URL}/api/company/${localStorage.getItem('company_Id')}`);
//                 setService(response.data); // Assuming response contains the services array
//             } catch (error) {
//                 console.error('Error fetching services:', error);
//             }
//         };

//         fetchServices();
//     }, []);

//     return (
//         <ServiceContext.Provider value={{ service, setService }}>
//             {children}
//         </ServiceContext.Provider>
//     );
// };
