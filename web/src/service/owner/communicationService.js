
import api from '../api';
// Fetch all users and categorize them
const fetchAllUsers = async () => {
  try {
    const response = await api.get(`/v2/superadmin/get-all-user`);
    const users = response.data;
    const admins = [];
    const customers = [];
    const anchors = [];

    users.forEach((user) => {
      const formattedUser = {
        id: user.user_ID,
        code: user.user_Code,
        name: user.user_Name,
        email: user.email_ID,
        mobile: user.mobile_Number,
        alter_Mobile_number: user.alter_Mobile_number,
        created_Date: user.created_Date,
        isActive: user.active_Flag
      };

      switch (user.user_Type_ID) {
        case 2:
          admins.push(formattedUser);
          break;
        case 4:
          anchors.push(formattedUser);
          break;
        case 5:
          customers.push(formattedUser);
          break;
        default:
          break;
      }
    });

    return { admins, anchors, customers };
  } catch (error) {
    /* console.error('Error fetching users:', error); */
    return { admins: [], anchors: [], customers: [] };
  }
};

// Send notification to users
const sendNotification = async (payload) => {
  try {
    const response = await api.post(`/v2/superadmin/notifications`, payload);
    return { success: true, data: response.data };
  } catch (error) {
    /* console.error('Error while sending notification', error); */
    return { success: false, error };
  }
};

// Mock data for complaints and tickets (to be replaced with actual API calls)
const getComplaints = () => [
  {
    id: 1,
    user: 'John Doe',
    issue: 'Order delayed by 2 days',
    status: 'Escalated',
  },
  {
    id: 2,
    user: 'Jane Smith',
    issue: 'Payment issue not resolved',
    status: 'Pending',
  },
];

const getTickets = () => [
  { id: 101, user: 'Ravi Kumar', topic: 'Account locked', status: 'Open' },
  { id: 102, user: 'Arun Mehta', topic: 'Refund not received', status: 'Resolved' },
];

const communicationService = {
  fetchAllUsers,
  sendNotification,
  getComplaints,
  getTickets
};

export default communicationService;