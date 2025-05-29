/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Button,
  TextField,
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  useTheme,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  EventNote as BookingsIcon,
  Person as UsersIcon,
  Build as EquipmentIcon,
  FilterList as FilterListIcon,
  CalendarToday as CalendarIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  CheckCircleOutline as ApproveIcon,
  CancelOutlined as RejectIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';
import { format, parse } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { BookingContext } from '../App';
import { deleteAllBookings } from '../services/BookingService';
import { useNavigate } from 'react-router-dom';

// Equipment options - would come from API in real app
const equipmentOptions = [
  { value: '1', label: 'Electron beam evaporation BC 300' },
  { value: '2', label: 'Electron bem evaporation AUTO 500' },
  { value: '3', label: 'RF sputter deposition' },
  { value: '4', label: 'Wet Station' },
  { value: '5', label: 'Spin Coater' },
  { value: '6', label: 'UV exposure system PCB' },
  { value: '7', label: 'Mask Aligner' },
  { value: '8', label: 'Laser Writer' },
  { value: '9', label: 'Annealing Furnace' },
  { value: '10', label: 'Diffusion furnace' },
  { value: '11', label: 'Reactive Ion etch system' },
  { value: '12', label: 'UV Ozone system' },
  { value: '13', label: 'Hot plate' },
  { value: '14', label: 'Microscope' },
  { value: '15', label: 'Probe station 2450' },
  { value: '16', label: 'Profilometer' },
  { value: '17', label: 'Reflectrometer' },
  { value: '18', label: 'Wire Bonder' },
  { value: '19', label: 'Probe station 4200' }
];

// Time slot options
const timeSlotOptions = [
  { value: '8:00', label: '8:00 AM - 11:00 AM' },
  { value: '11:00', label: '11:00 AM - 2:00 PM' },
  { value: '14:00', label: '2:00 PM - 5:00 PM' },
  { value: '17:00', label: '5:00 PM - 8:00 PM' }
];

// Status options for filtering
const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' }
];

// User type options
const userTypeOptions = [
  { value: 'tbi', label: 'TBI' },
  { value: 'mtech', label: 'M.Tech' },
  { value: 'btech', label: 'B.Tech' },
  { value: 'phd', label: 'Ph.D' },
  { value: 'other', label: 'Other' }
];

// Department options (in alphabetical order)
const departmentOptions = [
  { value: 'chem', label: 'Chemical Engineering' },
  { value: 'civil', label: 'Civil Engineering' },
  { value: 'cs', label: 'Computer Science' },
  { value: 'eee', label: 'Electrical & Electronics Engineering' },
  { value: 'ece', label: 'Electronics and Communication Engineering' },
  { value: 'ei', label: 'Electronics and Instrumentation' },
  { value: 'mech', label: 'Mechanical Engineering' },
  { value: 'bio', label: 'MSc. Biology' },
  { value: 'chemistry', label: 'MSc. Chemistry' },
  { value: 'economics', label: 'MSc. Economics' },
  { value: 'math', label: 'MSc. Math' },
  { value: 'physics', label: 'MSc. Physics' },
  { value: 'other', label: 'Other' }
];

// Faculty mapping data 
const facultyMapping = [
  { id: 'faculty1', email: 'f20211878@hyderabad.bits-pilani.ac.in', name: 'Faculty 1' },
  { id: 'faculty2', email: 'f20213183@hyderabad.bits-pilani.ac.in', name: 'Faculty 2' },
  { id: 'faculty3', email: 'f20210485@hyderabad.bits-pilani.ac.in', name: 'Faculty 3' },
  { id: 'faculty4', email: '', name: 'Faculty 4' },
  { id: 'faculty5', email: '', name: 'Faculty 5' }
];

// Faculty options for dropdown
const facultyOptions = [
  { value: 'faculty1', label: 'Faculty 1' },
  { value: 'faculty2', label: 'Faculty 2' },
  { value: 'faculty3', label: 'Faculty 3' },
  { value: 'faculty4', label: 'Faculty 4' },
  { value: 'faculty5', label: 'Faculty 5' }
];

const Admin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { bookings, updateBookingStatus, refreshBookings, addBooking } = useContext(BookingContext);
  const [activeTab, setActiveTab] = useState(0);
  const [adminData, setAdminData] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Dialog state
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selfBookingDialogOpen, setSelfBookingDialogOpen] = useState(false);
  
  // Self-booking form state
  const [selfBookingForm, setSelfBookingForm] = useState({
    executorName: '',
    processDate: null,
    startTime: '',
    endTime: '',
    processSummary: ''
  });
  
  // Date and time state for booking approval
  const [actualDate, setActualDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showSchedulingError, setShowSchedulingError] = useState(false);
  
  useEffect(() => {
    // Check if admin is authenticated
    const isAdminAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
      return;
    }
    
    // Get admin data
    try {
      const adminInfo = localStorage.getItem('adminUserInfo');
      if (adminInfo) {
        setAdminData(JSON.parse(adminInfo));
      }
    } catch (error) {
      console.error("Error parsing admin info:", error);
    }
  }, [navigate]);

  // Debug available bookings
  console.log('Available bookings in admin:', bookings.length, bookings);
  
  // Filter bookings based on selected filters
  const filteredBookings = bookings.filter(booking => {
    // Ensure booking exists and has required properties
    if (!booking) {
      console.log('Skipping undefined booking');
      return false;
    }
    
    // Debug individual booking
    console.log('Processing booking:', booking.id, booking.status, booking.equipment);
    
    // Filter by status
    if (statusFilter !== 'all' && booking.status !== statusFilter) {
      return false;
    }
    
    // Filter by equipment - account for different equipment data structures
    if (equipmentFilter !== 'all') {
      // Handle different ways equipment might be stored
      const equipmentValue = booking.equipment?.value || 
                            (typeof booking.equipment === 'string' ? booking.equipment : null);
      
      if (equipmentValue !== equipmentFilter) {
        return false;
      }
    }
    
    // Filter by date
    if (dateFilter !== 'all' && booking.date) {
      try {
        const bookingDate = new Date(booking.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const nextMonth = new Date(today);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        
        switch (dateFilter) {
          case 'today':
            return bookingDate.toDateString() === today.toDateString();
          case 'tomorrow':
            return bookingDate.toDateString() === tomorrow.toDateString();
          case 'week':
            return bookingDate >= today && bookingDate < nextWeek;
          case 'month':
            return bookingDate >= today && bookingDate < nextMonth;
          default:
            return true;
        }
      } catch (error) {
        console.error('Error parsing date for booking:', booking.id, error);
        return true; // Include it if date parsing fails
      }
    }
    
    return true;
  });
  
  // Debug filtered bookings
  console.log('Filtered bookings in admin:', filteredBookings.length);

  // Handle tab change 
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Get equipment name by value
  const getEquipmentName = (value) => {
    const equipment = equipmentOptions.find(eq => eq.value === value);
    return equipment ? equipment.label : 'Unknown Equipment';
  };
  
  // Get time slot label by value - simplified to just return the value
  const getTimeSlotLabel = (value) => {
    // If value is undefined or null, return 'N/A'
    if (!value) return 'N/A';
    
    // Just look up the label in the options array if it's a simple value
    if (typeof value === 'string') {
      const timeSlot = timeSlotOptions.find(ts => ts.value === value);
      if (timeSlot) {
        return timeSlot.label;
      }
    }
    
    // If it's an object with a label, return that
    if (value && typeof value === 'object' && value.label) {
      return value.label;
    }
    
    // Otherwise just return the value as is
    return String(value);
  };
  
  // Get chip color based on status
  const getStatusChipColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending_admin': return 'info'; // Faculty approved, waiting for admin
      case 'pending_faculty': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };
  
  // Get human-readable status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'pending_faculty': return 'Pending Faculty Approval';
      case 'pending_admin': return 'Faculty Approved, Pending Admin';
      case 'rejected': return 'Rejected';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  
  // Get approval status breakdown text
  const getApprovalBreakdown = (booking) => {
    if (!booking.approvalStatus) return null;
    
    const { faculty, admin } = booking.approvalStatus;
    const { status } = booking;
    
    // Determine the current stage in the approval process
    let statusText = '';
    let statusColor = 'default';
    let showAdminActions = false;
    
    if (status === 'rejected') {
      // Check who rejected it
      if (faculty === 'rejected') {
        statusText = 'Rejected by Faculty';
      } else if (admin === 'rejected') {
        statusText = 'Rejected by Admin';
      } else {
        statusText = 'Rejected';
      }
      statusColor = 'error';
    } else if (status === 'approved') {
      statusText = 'Fully Approved';
      statusColor = 'success';
    } else if (status === 'pending_faculty') {
      statusText = 'Pending Faculty Approval';
      statusColor = 'warning';
    } else if (status === 'pending_admin') {
      statusText = 'Faculty Approved, Pending Admin';
      statusColor = 'info';
      showAdminActions = true;
    }
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip 
          size="small" 
          label={statusText} 
          color={statusColor} 
        />
        {showAdminActions && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Approve Booking">
              <IconButton 
                size="small" 
                color="success" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenApproveDialog(booking);
                }}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reject Booking">
              <IconButton 
                size="small" 
                color="error" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenRejectDialog(booking);
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    );
  };
  
  // Format date safely (handles Firestore Timestamp, Date, string)
  const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';

    try {
      // 1. Firestore Timestamp instance
      if (dateInput?.toDate) {
        return format(dateInput.toDate(), 'MMM dd, yyyy');
      }

      // 2. Serialized Timestamp object { seconds, nanoseconds }
      if (typeof dateInput === 'object' && 'seconds' in dateInput) {
        return format(new Date(dateInput.seconds * 1000), 'MMM dd, yyyy');
      }

      // 3. JavaScript Date instance
      if (dateInput instanceof Date) {
        return format(dateInput, 'MMM dd, yyyy');
      }

      // 4. Fallback to parsing as string
      return format(new Date(dateInput), 'MMM dd, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error, dateInput);
      return 'N/A';
    }
  };
  
  // Get faculty name based on ID
  const getFacultyName = (id) => {
    const faculty = facultyMapping.find(f => f.id === id);
    return faculty ? faculty.name : id;
  };
  
  // Open details dialog
  const handleViewDetails = (booking) => {
    // Ensure we have all necessary data for the booking
    console.log('Viewing booking details:', booking);
    if (!booking.docId) {
      console.error('Warning: Selected booking is missing docId', booking);
    }
    setSelectedBooking(booking);
    setDetailsDialog(true);
    // Reset feedback text when opening dialog
    setFeedbackText('');
  };

  // Open approve dialog
  const handleOpenApproveDialog = (booking) => {
    setSelectedBooking(booking);
    setFeedbackText('');
    setApproveDialogOpen(true);
  };

  // Open reject dialog
  const handleOpenRejectDialog = (booking) => {
    setSelectedBooking(booking);
    setFeedbackText('');
    setRejectDialogOpen(true);
  };

  // Handle approve booking - updates Firebase database
  const handleApproveBooking = () => {
    if (selectedBooking) {
      // Validate time slots are selected
      if (!actualDate || !startTime || !endTime) {
        setShowSchedulingError(true);
        return;
      }
      
      try {
        // Ensure we have valid date objects before formatting
        const validActualDate = actualDate instanceof Date && !isNaN(actualDate) ? actualDate : new Date();
        const validStartTime = startTime instanceof Date && !isNaN(startTime) ? startTime : new Date();
        const validEndTime = endTime instanceof Date && !isNaN(endTime) ? endTime : new Date();
        
        // Format times for storage - use readable formats for direct display
        const formattedDate = format(validActualDate, 'MMM dd, yyyy');
        const formattedStartTime = format(validStartTime, 'h:mm a'); // Using AM/PM format
        const formattedEndTime = format(validEndTime, 'h:mm a'); // Using AM/PM format
        
        // Debug: log the actual values being formatted
        console.log('Raw date/time values:', {
          actualDate: validActualDate,
          startTime: validStartTime,
          endTime: validEndTime
        });
        
        console.log('Admin approving booking:', { 
          docId: selectedBooking.docId,
          id: selectedBooking.id,
          status: 'approved',
          feedback: feedbackText,
          actualDate: formattedDate,
          startTime: formattedStartTime,
          endTime: formattedEndTime
        });
        
        // Create the update data with status and time information
        const updateData = {
          status: 'approved',
          approvalStatus: {
            ...(selectedBooking.approvalStatus || { faculty: 'pending', admin: 'pending' }),
            admin: 'approved'
          },
          approvalNotes: feedbackText,
          lastModified: new Date().toISOString(),
          lastModifiedBy: 'admin',
          actualDate: formattedDate,
          actualTimeRange: {
            start: formattedStartTime,
            end: formattedEndTime
          }
        };
        
        // Update the booking status in Firebase - make sure we're explicitly passing the correct arguments
        updateBookingStatus(
          selectedBooking.docId,  // docId
          'approved',            // newStatus
          feedbackText,          // feedback
          'admin',               // updatedBy
          'admin',               // approverRole
          updateData             // additionalData - this contains our date/time values
        )
          .then(() => {
            console.log('Booking approval successful with time allocation');
            console.log('Approved with date/time:', {
              actualDate: formattedDate,
              timeRange: {
                start: formattedStartTime,
                end: formattedEndTime
              }
            });
            
            // Refresh bookings data from Firebase
            if (typeof refreshBookings === 'function') {
              refreshBookings();
            }
            
            // Reset state
            setActualDate(null);
            setStartTime(null);
            setEndTime(null);
            
            // Close dialogs
            setApproveDialogOpen(false);
            setDetailsDialog(false);
            setFeedbackText('');
          })
          .catch((error) => {
            console.error('Error updating booking in Firebase:', error);
            alert('There was an error approving this booking: ' + error.message);
          });
      } catch (error) {
        console.error('Error approving booking:', error);
        alert('There was an error approving this booking: ' + error.message);
      }
    }
  };

  // Handle reject booking - updates Firebase database
  const handleRejectBooking = () => {
    if (selectedBooking) {
      try {
        // Validate required data
        if (!selectedBooking.docId) {
          throw new Error('Missing document ID for this booking. Cannot update status.');
        }
        
        console.log('Admin rejecting booking:', { 
          docId: selectedBooking.docId,
          id: selectedBooking.id,
          status: 'rejected',
          feedback: feedbackText
        });
        
        // Create updated booking object with rejected status
        const updatedBooking = {
          ...selectedBooking,
          status: 'rejected',
          approvalStatus: {
            ...(selectedBooking.approvalStatus || { faculty: 'pending', admin: 'pending' }),
            admin: 'rejected'
          },
          rejectionReason: feedbackText,
          lastModified: new Date().toISOString(),
          lastModifiedBy: 'admin'
        };
        
        // Update the booking status in Firebase
        updateBookingStatus(selectedBooking.docId, 'rejected', 'admin', feedbackText)
          .then(() => {
            console.log('Booking rejection successful (Firebase updated):', updatedBooking);
            
            // Refresh bookings data from Firebase to ensure UI is up-to-date
            if (typeof refreshBookings === 'function') {
              refreshBookings();
            }
            
            // Close dialogs
            setRejectDialogOpen(false);
            setDetailsDialog(false);
            setFeedbackText('');
          })
          .catch((error) => {
            console.error('Error updating booking in Firebase:', error);
            alert('There was an error rejecting this booking: ' + error.message);
          });
      } catch (error) {
        console.error('Error rejecting booking:', error);
        alert('There was an error rejecting this booking: ' + error.message);
      }
    }
  };
  
  // Calculate dashboard statistics
  const totalBookings = bookings.length;
  const pendingFacultyBookings = bookings.filter(b => b.status === 'pending_faculty').length;
  const pendingAdminBookings = bookings.filter(b => b.status === 'pending_admin').length;
  const approvedBookings = bookings.filter(b => b.status === 'approved').length;
  const rejectedBookings = bookings.filter(b => b.status === 'rejected').length;
  
  // Calculate equipment usage statistics
  const equipmentUsage = equipmentOptions.map(eq => {
    const count = bookings.filter(b => b.equipment.value === eq.value).length;
    return {
      ...eq,
      count,
      percentage: totalBookings > 0 ? Math.round((count / totalBookings) * 100) : 0
    };
  });

  const handleSelfBookingSubmit = () => {
  // Simple validation
  if (!selfBookingForm.executorName || 
      !selfBookingForm.processDate || !selfBookingForm.startTime || 
      !selfBookingForm.endTime || !selfBookingForm.processSummary) {
    console.log('Missing required fields in self-booking');
    return;
  }
  
  console.log('Processing self booking with data:', selfBookingForm);

  try {
    // If processDate is a Date object, format it properly
    let formattedDate, formattedDateDisplay;
    if (selfBookingForm.processDate instanceof Date && !isNaN(selfBookingForm.processDate)) {
      formattedDate = format(selfBookingForm.processDate, 'yyyy-MM-dd');
      formattedDateDisplay = format(selfBookingForm.processDate, 'MMM dd, yyyy');
    } else if (typeof selfBookingForm.processDate === 'string') {
      // Handle string date input that might be in YYYY-MM-DD format
      try {
        const parsedDate = parse(selfBookingForm.processDate, 'yyyy-MM-dd', new Date());
        if (!isNaN(parsedDate.getTime())) {
          formattedDate = selfBookingForm.processDate; // already in right format
          formattedDateDisplay = format(parsedDate, 'MMM dd, yyyy');
        } else {
          // If parsing fails, just use the string as is
          formattedDate = selfBookingForm.processDate;
          formattedDateDisplay = selfBookingForm.processDate;
        }
      } catch (err) {
        console.error('Date parsing error:', err);
        formattedDate = selfBookingForm.processDate;
        formattedDateDisplay = selfBookingForm.processDate;
      }
    } else {
      // Fallback to current date if processDate is invalid
      const now = new Date();
      formattedDate = format(now, 'yyyy-MM-dd');
      formattedDateDisplay = format(now, 'MMM dd, yyyy');
    }
    
    // Format times for direct display - keep original input values if they're strings
    const startTimeDisplay = typeof selfBookingForm.startTime === 'string' ? 
      selfBookingForm.startTime : 
      (selfBookingForm.startTime instanceof Date && !isNaN(selfBookingForm.startTime)) ? 
        format(selfBookingForm.startTime, 'h:mm a') : '9:00 AM';
        
    const endTimeDisplay = typeof selfBookingForm.endTime === 'string' ? 
      selfBookingForm.endTime : 
      (selfBookingForm.endTime instanceof Date && !isNaN(selfBookingForm.endTime)) ? 
        format(selfBookingForm.endTime, 'h:mm a') : '12:00 PM';
      
    console.log('Time values for booking:', { 
      date: formattedDateDisplay, 
      startTime: startTimeDisplay, 
      endTime: endTimeDisplay 
    });
      
      // Create a new admin booking that will be DIRECTLY APPROVED
      const newAdminBooking = {
        id: `ADMIN-${Math.floor(Math.random() * 10000)}`,
        docId: `admin-${Math.floor(Math.random() * 10000)}`,
        status: 'approved', // This is important - set explicitly as approved
        name: selfBookingForm.executorName,
        student: {
          name: selfBookingForm.executorName,
          id: 'admin',
          email: 'admin@cleanroom.bits-pilani.ac.in'
        },
        studentEmail: 'none',
        email: 'none',
        equipment: 'none', // No equipment for admin bookings
        equipmentName: 'Admin Booking', // Display 'Admin Booking' instead of equipment name
        userType: 'admin', // Admin user type
        department: 'admin',
        processSummary: selfBookingForm.processSummary,
        faculty: 'admin', 
        facultyName: 'Admin', // Default faculty name
        actualDate: formattedDate, // String format
        actualDateFormatted: formattedDateDisplay, // String format
        preferredDate: 'N/A', // String
        preferredDateFormatted: 'N/A', // String
        actualTimeSlot: {
          start: startTimeDisplay, // Using our new time variable
          end: endTimeDisplay // Using our new time variable
        },
        // Add actualTimeRange for consistent display in the admin table
        actualTimeRange: {
          start: startTimeDisplay,
          end: endTimeDisplay
        },
        requestDate: new Date().toISOString(), // String format
        submittedAt: new Date().toISOString(), // String format
        lastModified: new Date().toISOString(), // String format
        approvalStatus: {
          faculty: 'approved', // Explicitly approved by faculty
          admin: 'approved'   // Explicitly approved by admin
        },
        createdBy: 'admin@cleanroom.bits-pilani.ac.in',
        isAdminCreated: true,
        adminCreated: true
      };
      
    console.log('Creating directly approved admin booking:', newAdminBooking);
      
      // Use the addBooking function from BookingContext to properly save the booking
      if (typeof addBooking === 'function') {
        addBooking(newAdminBooking)
          .then(() => {
            console.log('Admin booking successfully added to the database');
            // Close dialog and reset form
            setSelfBookingDialogOpen(false);
            setSelfBookingForm({
              executorName: '',
              processDate: null,
              startTime: '',
              endTime: '',
              processSummary: ''
            });
            
            // Show success message
            //alert('Admin booking created and automatically approved!');
            
            // Refresh the bookings list
            if (typeof refreshBookings === 'function') {
              refreshBookings();
            }
          })
          .catch((error) => {
            console.error('Error adding admin booking:', error);
            // No error alerts as per requirements
          });
      } else {
        throw new Error('addBooking function is not available in BookingContext');
      }
    } catch (e) {
      console.error('Error in admin self-booking:', e);
      // No error alerts as per requirements
    }
  };

  // Handle form field changes for self-booking
  const handleSelfBookingFormChange = (field, value) => {
    // Validate date and time objects
    let processedValue = value;
    
    // Make sure we don't save invalid date objects
    if (value instanceof Date && isNaN(value)) {
      console.warn(`Invalid Date object received for ${field}`);
      return; // Don't update with invalid date
    }
    
    setSelfBookingForm({
      ...selfBookingForm,
      [field]: processedValue
    });
  };

  // Export bookings to CSV
  const exportBookingsToCSV = () => {
    // Define the headers
    const headers = [
      'ID', 'Name', 'Equipment', 'Department', 'User Type',
      'Process Summary', 'Preferred Date', 'Approved Date',
      'Start Time', 'End Time', 'Status', 'Faculty', 'Submitted At'
    ];
    
    // Format the rows with booking data
    const rows = bookings.map(booking => [
      booking.id || '',
      booking.name || '',
      booking.equipmentName || '',
      booking.department || '',
      booking.userType || '',
      booking.processSummary || '',
      formatDate(booking.preferredDate) || 'N/A',
      formatDate(booking.actualDate) || 'N/A',
      booking.actualTimeRange?.start || 'N/A',
      booking.actualTimeRange?.end || 'N/A',
      booking.status || '',
      booking.facultyName || '',
      formatDate(booking.submittedAt) || 'N/A'
    ]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => 
        // Escape commas and quotes in cell values
        `"${String(cell).replace(/"/g, '""')}"`
      ).join(','))
    ].join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set up and trigger download
    link.setAttribute('href', url);
    link.setAttribute('download', `cleanroom-bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          Administrator Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage and monitor cleanroom equipment bookings
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, gap: 2 }}>
          <Button 
            variant="outlined" 
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={exportBookingsToCSV}
            sx={{
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
              '&:hover': {
                boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            Export to CSV
          </Button>
          <Button 
            variant="outlined" 
            color="error"
            onClick={async () => {
              if (window.confirm('Are you sure you want to delete ALL bookings? This cannot be undone!')) {
                try {
                  const deleteCount = await deleteAllBookings();
                  alert(`Successfully deleted ${deleteCount} bookings`);
                  refreshBookings(); // Refresh the bookings list
                } catch (error) {
                  console.error('Error deleting bookings:', error);
                  alert('Error deleting bookings: ' + error.message);
                }
              }
            }}
          >
            Delete All Bookings
          </Button>
        </Box>
      </Paper>
      
      {/* Tabs */}
      <Paper sx={{ mb: 4, borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          centered
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              py: 2,
              fontWeight: 'medium',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }
          }}
        >
          <Tab icon={<DashboardIcon />} label="Dashboard" iconPosition="start" />
          <Tab icon={<BookingsIcon />} label="Bookings" iconPosition="start" />
        </Tabs>
      </Paper>
      
      {/* Dashboard Tab */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h5" component="h2" gutterBottom sx={{ 
            fontWeight: 600, 
            borderLeft: '4px solid #3f51b5', 
            pl: 2,
            mb: 4
          }}>
            Dashboard Overview
          </Typography>
          
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  backgroundColor: '#4361ee',
                  backgroundImage: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 8px 20px rgba(67, 97, 238, 0.3)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
                elevation={4}
              >
                <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                  {totalBookings}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Total Bookings
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  backgroundColor: '#f77f00',
                  backgroundImage: 'linear-gradient(135deg, #f77f00 0%, #fcbf49 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 8px 20px rgba(247, 127, 0, 0.3)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
                elevation={4}
              >
                <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                  {pendingFacultyBookings}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Pending Faculty Approval
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  backgroundColor: '#4cc9f0',
                  backgroundImage: 'linear-gradient(135deg, #4cc9f0 0%, #4361ee 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 8px 20px rgba(76, 201, 240, 0.3)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
                elevation={4}
              >
                <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                  {pendingAdminBookings}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Pending Admin Approval
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Paper 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  backgroundColor: '#06d6a0',
                  backgroundImage: 'linear-gradient(135deg, #06d6a0 0%, #1b9aaa 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 8px 20px rgba(6, 214, 160, 0.3)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
                elevation={4}
              >
                <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                  {approvedBookings}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Fully Approved
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Paper 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  backgroundColor: '#ef476f',
                  backgroundImage: 'linear-gradient(135deg, #ef476f 0%, #c9184a 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 8px 20px rgba(239, 71, 111, 0.3)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}
                elevation={4}
              >
                <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
                  {rejectedBookings}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  Rejected Bookings
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Equipment Usage */}
          <Paper sx={{ 
            p: 4, 
            mb: 4, 
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: 600, 
              mb: 3,
              display: 'flex',
              alignItems: 'center'
            }}>
              <EquipmentIcon sx={{ mr: 1, color: 'primary.main' }} />
              Equipment Usage Statistics
            </Typography>
            <Grid container spacing={3}>
              {equipmentUsage.map((equipment) => (
                <Grid item xs={12} sm={6} md={4} key={equipment.value}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      borderRadius: '8px', 
                      backgroundColor: 'rgba(245, 245, 245, 0.7)',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(235, 235, 250, 0.9)',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1" fontWeight={600} color="primary.dark">
                        {equipment.label}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 500, 
                          backgroundColor: equipment.count > 0 ? 'primary.light' : 'grey.300',
                          color: equipment.count > 0 ? 'white' : 'text.secondary',
                          borderRadius: '12px',
                          px: 1.5,
                          py: 0.5,
                          fontSize: '0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center'
                        }}
                      >
                        {equipment.count} bookings
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 1, mb: 0.5 }}>
                      <Box sx={{ 
                        position: 'relative',
                        height: '6px',
                        backgroundColor: 'rgba(0,0,0,0.08)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <Box sx={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          height: '100%',
                          width: `${Math.max(equipment.percentage, 2)}%`, // minimum 2% width for visibility
                          backgroundColor: equipment.count > 0 ? 'primary.main' : 'grey.400',
                          borderRadius: '3px'
                        }} />
                      </Box>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          display: 'block', 
                          textAlign: 'right',
                          mt: 0.5,
                          color: 'text.secondary'
                        }}
                      >
                        {equipment.percentage}% usage
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      )}
      
      {/* Bookings Tab */}
      {activeTab === 1 && (
        <Box>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3 
          }}>
            <Typography variant="h5" component="h2" sx={{ 
              fontWeight: 600, 
              borderLeft: '4px solid #3f51b5', 
              pl: 2,
            }}>
              All Bookings
            </Typography>
            
            {/* Create Booking Button - positioned on the same line as heading */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setSelfBookingDialogOpen(true)}
              sx={{
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.2s ease',
                height: '40px',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              Create Booking
            </Button>
          </Box>
          
          {/* Filter Selection */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Paper 
                sx={{ 
                  p: 2, 
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                  Status
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    displayEmpty
                    sx={{ 
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    <MenuItem value="all">All Statuses</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper 
                sx={{ 
                  p: 2, 
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                  Equipment
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={equipmentFilter}
                    onChange={(e) => setEquipmentFilter(e.target.value)}
                    displayEmpty
                    sx={{ 
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    <MenuItem value="all">All Equipment</MenuItem>
                    {equipmentOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper 
                sx={{ 
                  p: 2, 
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>
                  Date Range
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    displayEmpty
                    sx={{ 
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    <MenuItem value="all">All Dates</MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="week">This Week</MenuItem>
                    <MenuItem value="month">This Month</MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Bookings Table */}
          <TableContainer 
            component={Paper} 
            sx={{ 
              borderRadius: '12px', 
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden'
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Student</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Equipment</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Preferred Date/Time</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Approved Date/Time</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No bookings found matching the selected filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>{booking.id}</TableCell>
                      <TableCell>
                        {booking.student?.name || booking.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {booking.equipment && booking.equipment.label ? 
                          booking.equipment.label : 
                          getEquipmentName(booking.equipment?.value || booking.equipment)}
                      </TableCell>
                      <TableCell>
                        {formatDate(booking.preferredDate || booking.date)}
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {getTimeSlotLabel(booking.preferredTimeSlot || booking.timeSlot)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {booking.status === 'approved' ? (
                          <>
                            <Typography variant="body2">
                              {formatDate(booking.actualDate)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {booking.actualTimeRange && booking.actualTimeRange.start && booking.actualTimeRange.end ? 
                                `${booking.actualTimeRange.start} - ${booking.actualTimeRange.end}` : 
                                'No specific time set'}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Not yet approved
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box>
                          {booking.approvalStatus ? (
                            <Chip 
                              size="small" 
                              label={getStatusLabel(booking.status)}
                              color={getStatusChipColor(booking.status)}
                            />
                          ) : (
                            <Chip 
                              size="small"
                              label={getStatusLabel(booking.status)}
                              color={getStatusChipColor(booking.status)}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton 
                              color="info" 
                              size="small"
                              onClick={() => handleViewDetails(booking)}
                            >
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          {/* Show prominent approve/reject buttons for bookings pending admin approval */}
                          {booking.status === 'pending_admin' && (
                            <>
                              <Tooltip title="Approve as Admin">
                                <IconButton 
                                  color="success" 
                                  size="small"
                                  onClick={() => handleOpenApproveDialog(booking)}
                                >
                                  <ApproveIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Reject as Admin">
                                <IconButton 
                                  color="error" 
                                  size="small"
                                  onClick={() => handleOpenRejectDialog(booking)}
                                >
                                  <RejectIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          
                          {/* Admin can still reject bookings in other states except already rejected ones */}
                          {booking.status !== 'pending_admin' && booking.status !== 'rejected' && (
                            <Tooltip title="Reject as Admin">
                              <IconButton 
                                color="error" 
                                size="small"
                                onClick={() => handleOpenRejectDialog(booking)}
                              >
                                <RejectIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      
      {/* Filter Dialog */}
      <Dialog 
        open={filterDialogOpen} 
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Filter Bookings</Typography>
            <IconButton onClick={() => setFilterDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="status-filter-dialog-label">Status</InputLabel>
                <Select
                  labelId="status-filter-dialog-label"
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="equipment-filter-dialog-label">Equipment</InputLabel>
                <Select
                  labelId="equipment-filter-dialog-label"
                  value={equipmentFilter}
                  label="Equipment"
                  onChange={(e) => setEquipmentFilter(e.target.value)}
                >
                  <MenuItem value="all">All Equipment</MenuItem>
                  {equipmentOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="date-filter-dialog-label">Date Range</InputLabel>
                <Select
                  labelId="date-filter-dialog-label"
                  value={dateFilter}
                  label="Date Range"
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <MenuItem value="all">All Dates</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setStatusFilter('all');
              setEquipmentFilter('all');
              setDateFilter('all');
            }}
          >
            Reset Filters
          </Button>
          <Button 
            variant="contained" 
            onClick={() => setFilterDialogOpen(false)}
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Booking Details Dialog */}
      <Dialog 
        open={detailsDialog} 
        onClose={() => setDetailsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Booking Details
          {selectedBooking && (
            <Chip 
              label={selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)} 
              color={getStatusChipColor(selectedBooking.status)}
              size="small"
              sx={{ ml: 2 }}
            />
          )}
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Booking ID
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedBooking.id}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Request Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(selectedBooking.submittedAt) || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Student Name
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedBooking.student?.name || selectedBooking.name || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Student ID
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedBooking.student?.id || selectedBooking.studentId || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Faculty
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {getFacultyName(selectedBooking.faculty) || 'Not specified'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Equipment
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedBooking.equipment && selectedBooking.equipment.label ? 
                    selectedBooking.equipment.label : 
                    getEquipmentName(selectedBooking.equipment?.value || selectedBooking.equipment)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Preferred Booking Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(selectedBooking.preferredDate || selectedBooking.date)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Preferred Time Slot
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {getTimeSlotLabel(selectedBooking.preferredTimeSlot || selectedBooking.timeSlot)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Student Email
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedBooking.studentEmail || selectedBooking.student?.email || 'Not specified'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  User Type
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedBooking.userType === 'other' 
                    ? `Other: ${selectedBooking.userTypeOther || 'Not specified'}`
                    : userTypeOptions.find(ut => ut.value === selectedBooking.userType)?.label || 'Not specified'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {departmentOptions.find(d => d.value === selectedBooking.department)?.label || 'Not specified'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Purpose of Booking
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedBooking.purpose || selectedBooking.description || 'Not specified'}
                </Typography>
              </Grid>
              
              {/* Show actual allocated date/time if they exist */}
              {selectedBooking.actualDate && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Allocated Date
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatDate(selectedBooking.actualDate)}
                  </Typography>
                </Grid>
              )}
              
              {selectedBooking.actualTimeRange && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Allocated Time Slot
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {selectedBooking.actualTimeRange.start && selectedBooking.actualTimeRange.end ? 
                      `${selectedBooking.actualTimeRange.start} - ${selectedBooking.actualTimeRange.end}` : 
                      'Time not specified'}
                  </Typography>
                </Grid>
              )}
              
              {/* Project Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Project Information
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Project Code and Name
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedBooking.projectCodeName || 'Not specified'}
                </Typography>
              </Grid>
              
              {/* Sample Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mt: 2 }}>
                  Sample Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Sample Type
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedBooking.sampleType || 'Not specified'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Sample History
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedBooking.sampleHistory || 'Not specified'}
                </Typography>
              </Grid>
              
              {/* Additional Remarks */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Additional Remarks
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedBooking.additionalRemarks || 'None'}
                </Typography>
              </Grid>
              
              {/* Show current status information if not pending */}
              {selectedBooking.status !== 'pending' && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 3 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Current Status
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Chip 
                        label={selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)} 
                        color={getStatusChipColor(selectedBooking.status)}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {selectedBooking.status === 'approved' ? 'Approved by ' : 'Rejected by '}
                        {selectedBooking.lastModifiedBy || 'faculty/admin'}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                      Feedback
                    </Typography>
                    <Typography variant="body1">
                      {selectedBooking.rejectionReason || selectedBooking.approvalNotes || 'No feedback provided'}
                    </Typography>
                  </Grid>
                </>
              )}
              
              {/* Admin veto section - allow status change regardless of current state */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" color="primary" gutterBottom fontWeight={500}>
                  Admin Veto Controls
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  As an administrator, you can override the current booking status:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Button 
                    variant="outlined" 
                    color="success"
                    onClick={() => handleOpenApproveDialog(selectedBooking)}
                    startIcon={<ApproveIcon />}
                    disabled={selectedBooking?.status === 'approved'}
                  >
                    Change to Approved
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error"
                    onClick={() => handleOpenRejectDialog(selectedBooking)}
                    startIcon={<RejectIcon />}
                    disabled={selectedBooking?.status === 'rejected'}
                  >
                    Change to Rejected
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Approve Booking Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Approve Booking as Admin</DialogTitle>
        <DialogContent>
          <DialogContentText gutterBottom>
            Please allocate a date and time for this booking request. You can use the student's preferred time or set a different schedule.
          </DialogContentText>
          
          {selectedBooking && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" gutterBottom>
                Student's Preferred Schedule:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Preferred Date:</Typography>
                  <Typography variant="body1">
                    {formatDate(selectedBooking.preferredDate || selectedBooking.date)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Preferred Time Slot:</Typography>
                  <Typography variant="body1">
                    {getTimeSlotLabel(selectedBooking.preferredTimeSlot || selectedBooking.timeSlot)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
          
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Allocate Schedule:
          </Typography>
          
          {showSchedulingError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Please select both a date and time slot before approving
            </Alert>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Allocated Date"
                  value={actualDate}
                  onChange={(date) => {
                    setActualDate(date);
                    setShowSchedulingError(false);
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      error: showSchedulingError && !actualDate,
                      helperText: showSchedulingError && !actualDate ? "Date is required" : ""
                    }
                  }}
                  minDate={new Date()}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="Start Time"
                      value={startTime}
                      onChange={(time) => {
                        setStartTime(time);
                        setShowSchedulingError(false);
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: showSchedulingError && !startTime,
                          helperText: showSchedulingError && !startTime ? "Start time required" : ""
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TimePicker
                      label="End Time"
                      value={endTime}
                      onChange={(time) => {
                        setEndTime(time);
                        setShowSchedulingError(false);
                      }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: showSchedulingError && !endTime,
                          helperText: showSchedulingError && !endTime ? "End time required" : ""
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <TextField
              margin="dense"
              id="feedback"
              label="Approval Notes"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              helperText="Optional notes for this approval"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleApproveBooking} 
            color="success" 
            variant="contained"
          >
            Approve as Admin
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Booking Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Booking as Admin</DialogTitle>
        <DialogContent>
          <DialogContentText gutterBottom>
            Are you sure you want to reject this booking request as an administrator?
            {selectedBooking && selectedBooking.status === 'pending_admin' ? 
              " This will override the faculty approval." :
              " The booking will be marked as rejected."}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="reason"
            label="Rejection Reason"
            fullWidth
            required
            multiline
            rows={3}
            variant="outlined"
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleRejectBooking} 
            color="error" 
            variant="contained"
            disabled={!feedbackText.trim()} // Require a reason for rejection
          >
            Reject as Admin
          </Button>
        </DialogActions>
      </Dialog>

      {/* Self Booking Dialog */}
      <Dialog
        open={selfBookingDialogOpen}
        onClose={() => setSelfBookingDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create Self-Booking</DialogTitle>
        <DialogContent>
          <DialogContentText gutterBottom>
            Please fill in the details for your booking request.
          </DialogContentText>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="executorName"
                label="Executor Name"
                fullWidth
                required
                variant="outlined"
                value={selfBookingForm.executorName}
                onChange={(e) => handleSelfBookingFormChange('executorName', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="processDate"
                label="Process Date (YYYY-MM-DD)"
                fullWidth
                required
                variant="outlined"
                value={selfBookingForm.processDate instanceof Date 
                  ? format(selfBookingForm.processDate, 'yyyy-MM-dd')
                  : selfBookingForm.processDate || ''}
                onChange={(e) => {
                  // Try to parse the date string
                  try {
                    const dateValue = e.target.value;
                    // Simple validation for YYYY-MM-DD format
                    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
                      const parsedDate = parse(dateValue, 'yyyy-MM-dd', new Date());
                      if (!isNaN(parsedDate.getTime())) {
                        handleSelfBookingFormChange('processDate', parsedDate);
                      } else {
                        handleSelfBookingFormChange('processDate', dateValue);
                      }
                    } else {
                      handleSelfBookingFormChange('processDate', dateValue);
                    }
                  } catch (err) {
                    console.error('Date parsing error:', err);
                    handleSelfBookingFormChange('processDate', e.target.value);
                  }
                }}
                helperText="Format: YYYY-MM-DD (e.g., 2025-05-10)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    id="startTime"
                    label="Start Time (HH:MM)"
                    fullWidth
                    required
                    variant="outlined"
                    value={selfBookingForm.startTime instanceof Date 
                      ? format(selfBookingForm.startTime, 'HH:mm')
                      : selfBookingForm.startTime || ''}
                    onChange={(e) => handleSelfBookingFormChange('startTime', e.target.value)}
                    helperText="Format: HH:MM (e.g., 09:30)"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    id="endTime"
                    label="End Time (HH:MM)"
                    fullWidth
                    required
                    variant="outlined"
                    value={selfBookingForm.endTime instanceof Date 
                      ? format(selfBookingForm.endTime, 'HH:mm')
                      : selfBookingForm.endTime || ''}
                    onChange={(e) => handleSelfBookingFormChange('endTime', e.target.value)}
                    helperText="Format: HH:MM (e.g., 12:30)"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <TextField
                margin="dense"
                id="processSummary"
                label="Process Summary"
                fullWidth
                required
                multiline
                rows={3}
                variant="outlined"
                placeholder="Brief description of the work to be done"
                value={selfBookingForm.processSummary}
                onChange={(e) => handleSelfBookingFormChange('processSummary', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelfBookingDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSelfBookingSubmit} 
            color="success" 
            variant="contained"
          >
            Create Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Admin;
