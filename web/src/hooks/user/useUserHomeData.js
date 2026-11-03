import { useState, useEffect } from "react";
import serviceService from "../../service/user/serviceService";

export const useUserHomeData = () => {
  const [services, setServices] = useState([]);
  const [servicesName, setServicesName] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [serviceNamesData, serviceSubTypesData] = await Promise.all([
          serviceService.getAllServices(),
          serviceService.getServiceSubTypes(),
        ]);
        setServices(serviceSubTypesData);
        setServicesName(serviceNamesData);
      } catch (error) {
        /* console.error("Error fetching services:", error); */
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { services, servicesName, loading };
};
