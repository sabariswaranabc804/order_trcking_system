import { useState, useEffect } from 'react';
import communicationService from '../../service/owner/communicationService';

const useCommunication = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [notification, setNotification] = useState('');
  const initialReceiver = {
    admin: '',
    anchor: '',
    customer: ''
  };
  const [receiver, setReceiver] = useState(initialReceiver);
  const [admins, setAdmins] = useState([]);
  const [anchors, setAnchors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [tickets, setTickets] = useState([]);

  // Fetch users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      const { admins, anchors, customers } = await communicationService.fetchAllUsers();
      setAdmins(admins);
      setAnchors(anchors);
      setCustomers(customers);
    };

    loadUsers();
    setComplaints(communicationService.getComplaints());
    setTickets(communicationService.getTickets());
  }, []);

  // Handle sending notification
  const handleSendNotification = async () => {
    try {
      const expand = (selected, list, allLabel) => {
        return selected === allLabel ? list.map(user => user.code) : selected ? [selected] : [];
      };

      const expandedReceiver = {
        admin: expand(receiver.admin, admins, 'All Admins'),
        anchor: expand(receiver.anchor, anchors, 'All Anchors'),
        customer: expand(receiver.customer, customers, 'All Customers'),
      };

      const payload = {
        title,
        message: notification,
        receiver: expandedReceiver
      };

      const result = await communicationService.sendNotification(payload);
      if (result.success) {
        // Reset form after successful submission
        setNotification('');
        setTitle('');
        setReceiver(initialReceiver);
      }
    } catch (error) {
      /* console.error('Error in handleSendNotification:', error); */
    }
  };

  // Handle receiver selection change
  const handleReceiverChange = (type, value) => {
    setReceiver(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return {
    tabIndex,
    setTabIndex,
    title,
    setTitle,
    notification,
    setNotification,
    receiver,
    handleReceiverChange,
    admins,
    anchors,
    customers,
    complaints,
    tickets,
    handleSendNotification
  };
};

export default useCommunication;