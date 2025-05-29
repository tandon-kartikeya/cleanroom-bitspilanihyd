import React, { useState, useContext, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box,
  Tabs,
  Tab,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  useTheme,
  Divider,
  Alert,
  Snackbar,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
  AccountCircle as ProfileIcon,
  Info as InfoIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format, parseISO } from 'date-fns';
import { BookingContext } from '../App';
import { AuthContext } from '../context/AuthContext';
import { getFacultyOptions } from '../config/facultyList';
import { getStudentBookings } from '../services/BookingService';
import { useNavigate } from 'react-router-dom';

// Data for form
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

const timeSlotOptions = [
  { value: '8:00', label: '8:00 AM - 11:00 AM' },
  { value: '11:00', label: '11:00 AM - 2:00 PM' },
  { value: '14:00', label: '2:00 PM - 5:00 PM' },
  { value: '17:00', label: '5:00 PM - 8:00 PM' }
];

// Using faculty options from shared configuration
const facultyOptions = getFacultyOptions();

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

const Student = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { currentUser } = useContext(AuthContext);
  const { addBooking, bookings, loading, error } = useContext(BookingContext);
  const [studentBookings, setStudentBookings] = useState([]);
  const [loadingStudentBookings, setLoadingStudentBookings] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  // State for booking form
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    equipment: '',
    faculty: '',
    preferredDate: null,
    preferredTimeSlot: '',
    description: '',
    // New fields
    userType: '',
    userTypeOther: '',
    projectCodeName: '',
    department: '',
    sampleType: '',
    sampleHistory: '',
    additionalRemarks: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Dialog state
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
  
  // Handle opening the details dialog
  const handleOpenDetails = (booking) => {
    setSelectedBookingDetails(booking);
    setDetailsOpen(true);
  };
  
  // Handle closing the details dialog
  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedBookingDetails(null);
  };
  
  // Populate student info from Google Auth
  useEffect(() => {
    if (currentUser) {
      // Nothing needed here, as we're using currentUser directly in the component
    }
  }, [currentUser]);

  // Fetch student-specific bookings
  useEffect(() => {
    const fetchStudentBookings = async () => {
      if (!currentUser || !currentUser.email) return;
      
      try {
        setLoadingStudentBookings(true);
        const fetchedBookings = await getStudentBookings(currentUser.email);
        console.log("Fetched student bookings:", fetchedBookings);
        setStudentBookings(fetchedBookings);
      } catch (err) {
        console.error('Error fetching student bookings:', err);
        setFormErrors('Failed to load your bookings. Please try again later.');
      } finally {
        setLoadingStudentBookings(false);
      }
    };
    
    fetchStudentBookings();
  }, [currentUser]);

  // Create a function to refresh bookings
  const refreshBookings = async () => {
    if (!currentUser || !currentUser.email) return;
    
    try {
      setLoadingStudentBookings(true);
      const fetchedBookings = await getStudentBookings(currentUser.email);
      console.log("Refreshed student bookings:", fetchedBookings);
      setStudentBookings(fetchedBookings);
    } catch (err) {
      console.error('Error refreshing student bookings:', err);
    } finally {
      setLoadingStudentBookings(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle form field changes
  const handleFormChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // Clear error for the field
    if (formErrors[field]) {
      setFormErrors({
        ...formErrors,
        [field]: null
      });
    }
  };
  
  // Validate form step
  const validateStep = () => {
    const errors = {};
    
    switch (activeStep) {
      case 0:
        if (!formData.equipment) errors.equipment = 'Please select an equipment';
        if (!formData.faculty) errors.faculty = 'Please select a faculty';
        // User type, department and project are optional as requested
        break;
      case 1:
        if (!formData.preferredDate && !selectedDate) errors.preferredDate = 'Please select a preferred date';
        if (!formData.preferredTimeSlot) errors.preferredTimeSlot = 'Please select a preferred time slot';
        break;
      case 2:
        // No validation for description
        break;
      case 3:
        // Validate all fields for final review
        if (!formData.equipment) errors.equipment = 'Please select an equipment';
        if (!formData.faculty) errors.faculty = 'Please select a faculty';
        if (!formData.preferredDate && !selectedDate) errors.preferredDate = 'Please select a preferred date';
        if (!formData.preferredTimeSlot) errors.preferredTimeSlot = 'Please select a preferred time slot';
        break;
      default:
        break;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle next step
  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (validateStep() && currentUser) {
      try {
        setFormLoading(true);
        
        // Extract BITS student ID from email
        let bitsStudentId = '';
        if (currentUser.email) {
          // Extract student ID from email (e.g., f20190001@hyderabad.bits-pilani.ac.in)
          const emailPrefix = currentUser.email.split('@')[0];
          if (emailPrefix && emailPrefix.length > 0) {
            bitsStudentId = emailPrefix.toUpperCase();
          }
        }
        
        // Add student information to the booking
        const bookingWithStudentInfo = {
          name: currentUser.displayName || 'Unknown User',
          studentId: bitsStudentId || currentUser.uid, // Use BITS ID if available, fallback to UID
          studentEmail: currentUser.email,
          equipment: formData.equipment,
          preferredDate: selectedDate || formData.preferredDate,
          preferredTimeSlot: formData.preferredTimeSlot,
          faculty: formData.faculty,
          description: formData.description,
          status: 'pending_faculty', // Initially pending faculty approval
          // New fields
          userType: formData.userType,
          userTypeOther: formData.userType === 'other' ? formData.userTypeOther : '',
          projectCodeName: formData.projectCodeName,
          department: formData.department,
          sampleType: formData.sampleType,
          sampleHistory: formData.sampleHistory,
          additionalRemarks: formData.additionalRemarks,
          createdAt: new Date().toISOString(),
          approvalStatus: {
            faculty: 'pending',
            admin: 'pending'
          }
        };
        
        console.log("Creating booking with data:", bookingWithStudentInfo);
        
        // Create the booking
        await addBooking(bookingWithStudentInfo);
        
        // Reset form
        setFormData({
          equipment: '',
          preferredDate: '',
          preferredTimeSlot: '',
          faculty: '',
          description: '',
          userType: '',
          userTypeOther: '',
          projectCodeName: '',
          department: '',
          sampleType: '',
          sampleHistory: '',
          additionalRemarks: ''
        });
        setSelectedDate(null);
        setActiveStep(0);
        
        // Show success
        setSuccessMessage('Booking submitted successfully!');
        
        // Refresh the bookings list to show the new booking
        await refreshBookings();
        
        // Change tab to show the pending bookings
        setTabValue(0); // Switch to the pending tab to show the new booking
        
      } catch (error) {
        console.error('Error submitting booking:', error);
        setFormErrors('Failed to submit booking. Please try again.');
      } finally {
        setFormLoading(false);
      }
    }
  };
  
  // Handle close success message
  const handleCloseSuccessMessage = () => {
    setSuccessMessage(null);
  };
  
  // Format date correctly
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      // Handle if dateStr is a Firestore timestamp object
      if (dateStr && typeof dateStr === 'object' && dateStr.seconds) {
        return format(new Date(dateStr.seconds * 1000), 'MMM dd, yyyy');
      }
      // Handle regular date strings
      return format(new Date(dateStr), 'MMM dd, yyyy');
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'N/A';
    }
  };

  // Get equipment name by value
  const getEquipmentName = (value) => {
    const equipment = equipmentOptions.find(eq => eq.value === value);
    return equipment ? equipment.label : 'Unknown Equipment';
  };

  // Get time slot label by value
  const getTimeSlotLabel = (value) => {
    const timeSlot = timeSlotOptions.find(ts => ts.value === value);
    return timeSlot ? timeSlot.label : value;
  };

  // Format time range object to string
  const formatTimeRange = (timeRange) => {
    if (!timeRange) return 'N/A';
    
    // Handle if timeRange is already a string
    if (typeof timeRange === 'string') return timeRange;
    
    // Handle timeRange object with start and end properties
    if (timeRange.start && timeRange.end) {
      return `${timeRange.start} - ${timeRange.end}`;
    }
    
    // Fallback
    return JSON.stringify(timeRange);
  };

  // Get status chip color based on status
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
      case 'pending': return 'Pending'; // For backward compatibility
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  
  // Render status chip
  const renderStatusChip = (status) => {
    switch (status) {
      case 'pending':
      case 'pending_faculty':
        return <Chip 
          icon={<ScheduleIcon />} 
          label={getStatusLabel(status)} 
          color="warning" 
          size="small" 
        />;
      case 'pending_admin':
        return <Chip 
          icon={<ScheduleIcon />} 
          label={getStatusLabel(status)} 
          color="info" 
          size="small" 
        />;
      case 'approved':
        return <Chip 
          icon={<CheckCircleIcon />} 
          label={getStatusLabel(status)} 
          color="success" 
          size="small" 
        />;
      case 'rejected':
        return <Chip 
          icon={<CancelIcon />} 
          label={getStatusLabel(status)} 
          color="error" 
          size="small" 
        />;
      default:
        return <Chip label={getStatusLabel(status)} size="small" />;
    }
  };
  
  // Render bookings table
  const renderBookingsTable = (bookings) => {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Equipment</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time Slot</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.id}</TableCell>
                  <TableCell>
                    {getEquipmentName(booking.equipment)}
                  </TableCell>
                  <TableCell>
                    {booking.actualDate ? (
                      <>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {formatDate(booking.actualDate)} <span style={{ color: 'green' }}>(Assigned)</span>
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Requested: {formatDate(booking.preferredDate)}
                        </Typography>
                      </>
                    ) : (
                      <>
                        {formatDate(booking.preferredDate)}
                        {(booking.status === 'pending' || booking.status === 'pending_faculty' || booking.status === 'pending_admin') && 
                          <Typography variant="caption" display="block" color="text.secondary">
                            (Preferred)
                          </Typography>
                        }
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {booking.actualTimeRange ? (
                      <>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {formatTimeRange(booking.actualTimeRange)} <span style={{ color: 'green' }}>(Assigned)</span>
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Requested: {getTimeSlotLabel(booking.preferredTimeSlot)}
                        </Typography>
                      </>
                    ) : (
                      <>
                        {getTimeSlotLabel(booking.preferredTimeSlot)}
                        {(booking.status === 'pending' || booking.status === 'pending_faculty' || booking.status === 'pending_admin') && 
                          <Typography variant="caption" display="block" color="text.secondary">
                            (Preferred)
                          </Typography>
                        }
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {renderStatusChip(booking.status)}
                    {booking.approvalStatus && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" display="block" color="text.secondary">
                          {booking.status === 'pending_faculty' && 'Waiting for faculty approval'}
                          {booking.status === 'pending_admin' && 'Faculty approved, waiting for admin approval'}
                          {booking.status === 'approved' && 'Approved by both faculty and admin'}
                          {booking.status === 'rejected' && booking.approvalStatus.faculty === 'rejected' && 'Rejected by faculty'}
                          {booking.status === 'rejected' && booking.approvalStatus.admin === 'rejected' && 'Rejected by admin'}
                        </Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDetails(booking)}
                        color="primary"
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No bookings found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  // Render step content
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom>
              User and Project Information
            </Typography>
            
            {/* User Type */}
            <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>User Information</Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="user-type-label">User Type</InputLabel>
              <Select
                labelId="user-type-label"
                value={formData.userType}
                onChange={(e) => handleFormChange('userType', e.target.value)}
                label="User Type"
              >
                {userTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Other User Type (only shows if "Other" is selected) */}
            {formData.userType === 'other' && (
              <TextField
                label="Please specify"
                value={formData.userTypeOther}
                onChange={(e) => handleFormChange('userTypeOther', e.target.value)}
                fullWidth
                sx={{ mb: 3 }}
              />
            )}
            
            {/* Department */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                value={formData.department}
                onChange={(e) => handleFormChange('department', e.target.value)}
                label="Department"
              >
                {departmentOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {/* Project Code and Name */}
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Project Information</Typography>
            <TextField
              label="Project Code and Name"
              value={formData.projectCodeName}
              onChange={(e) => handleFormChange('projectCodeName', e.target.value)}
              fullWidth
              placeholder="Enter if this is part of a project (can be left blank)"
              sx={{ mb: 3 }}
            />
            
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>Equipment and Faculty Selection</Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }} error={Boolean(formErrors.equipment)}>
              <InputLabel id="equipment-label">Equipment</InputLabel>
              <Select
                labelId="equipment-label"
                value={formData.equipment}
                onChange={(e) => handleFormChange('equipment', e.target.value)}
                label="Equipment"
              >
                {equipmentOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.equipment && (
                <Typography color="error" variant="caption">
                  {formErrors.equipment}
                </Typography>
              )}
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }} error={Boolean(formErrors.faculty)}>
              <InputLabel id="faculty-label">Faculty</InputLabel>
              <Select
                labelId="faculty-label"
                value={formData.faculty}
                onChange={(e) => handleFormChange('faculty', e.target.value)}
                label="Faculty"
              >
                {facultyOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.faculty && (
                <Typography color="error" variant="caption">
                  {formErrors.faculty}
                </Typography>
              )}
            </FormControl>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Select Preferred Date and Time
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please select your preferred date and time slot. The admin may assign a different time based on availability.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Preferred Date"
                    value={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      handleFormChange('preferredDate', date);
                    }}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth 
                        error={Boolean(formErrors.preferredDate)}
                        helperText={formErrors.preferredDate}
                      />
                    )}
                    minDate={new Date()}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={Boolean(formErrors.preferredTimeSlot)}>
                  <InputLabel id="time-slot-label">Preferred Time Slot</InputLabel>
                  <Select
                    labelId="time-slot-label"
                    value={formData.preferredTimeSlot}
                    onChange={(e) => handleFormChange('preferredTimeSlot', e.target.value)}
                    label="Preferred Time Slot"
                  >
                    {timeSlotOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.preferredTimeSlot && (
                    <Typography color="error" variant="caption">
                      {formErrors.preferredTimeSlot}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            
            {/* Sample Information */}
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Sample Information</Typography>
            <TextField
              label="Sample Type"
              value={formData.sampleType}
              onChange={(e) => handleFormChange('sampleType', e.target.value)}
              fullWidth
              placeholder="Describe the type of sample you'll be using"
              sx={{ mb: 3 }}
            />
            
            <TextField
              label="Sample History"
              value={formData.sampleHistory}
              onChange={(e) => handleFormChange('sampleHistory', e.target.value)}
              fullWidth
              multiline
              rows={2}
              placeholder="Provide any relevant history or background of the sample"
              sx={{ mb: 3 }}
            />
            
            {/* Description and Additional Remarks */}
            <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Work Description</Typography>
            <TextField
              label="Description of work"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              fullWidth
              placeholder="Describe the work you plan to do with this equipment..."
              error={Boolean(formErrors.description)}
              helperText={formErrors.description}
              sx={{ mb: 3 }}
            />
            
            <TextField
              label="Additional Remarks"
              multiline
              rows={2}
              value={formData.additionalRemarks}
              onChange={(e) => handleFormChange('additionalRemarks', e.target.value)}
              fullWidth
              placeholder="Any other information or special requirements"
            />
          </Box>
        );
      case 3:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Your Booking
            </Typography>
            <Grid container spacing={2}>
              {/* Equipment and Faculty */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  Booking Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Equipment
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {equipmentOptions.find(eq => eq.value === formData.equipment)?.label}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Faculty
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {facultyOptions.find(eq => eq.value === formData.faculty)?.label}
                </Typography>
              </Grid>
              
              {/* Date and Time */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mt: 2 }}>
                  Schedule
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Preferred Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formData.preferredDate ? formatDate(formData.preferredDate) : selectedDate ? formatDate(selectedDate) : ''}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Preferred Time Slot
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {getTimeSlotLabel(formData.preferredTimeSlot)}
                </Typography>
              </Grid>
              
              {/* User Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mt: 2 }}>
                  User Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  User Type
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formData.userType === 'other'
                    ? `Other: ${formData.userTypeOther}`
                    : userTypeOptions.find(ut => ut.value === formData.userType)?.label || 'Not specified'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {departmentOptions.find(d => d.value === formData.department)?.label || 'Not specified'}
                </Typography>
              </Grid>
              
              {/* Project Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mt: 2 }}>
                  Project Information
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Project Code and Name
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formData.projectCodeName || 'Not specified'}
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
                  {formData.sampleType || 'Not specified'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Sample History
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formData.sampleHistory || 'Not specified'}
                </Typography>
              </Grid>
              
              {/* Work Description */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mt: 2 }}>
                  Work Details
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formData.description || 'Not specified'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Additional Remarks
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formData.additionalRemarks || 'None'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };
  
  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            You must be logged in as a student to view this page
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/student/login')}
            sx={{ mt: 2 }}
          >
            Student Login
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with profile button */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4
        }}
      >
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            fontWeight: 700,
            color: theme.palette.primary.main
          }}
        >
          Student Dashboard
        </Typography>
        
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ProfileIcon />}
          onClick={() => navigate('/profile/student/student1')}
        >
          Profile
        </Button>
      </Box>

      {/* Success message */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={6000}
        onClose={handleCloseSuccessMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSuccessMessage}
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
      
      {/* Booking Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedBookingDetails && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Booking Details: {selectedBookingDetails.id}</Typography>
                <IconButton onClick={handleCloseDetails} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                {/* Left column */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Booking Information
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">Equipment</Typography>
                    <Typography variant="body1" gutterBottom>
                      {getEquipmentName(selectedBookingDetails.equipment)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">Faculty</Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedBookingDetails.faculty && 
                        facultyOptions.find(f => f.value === selectedBookingDetails.faculty)?.label || 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">User Type</Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedBookingDetails.userType === 'other'
                        ? `Other: ${selectedBookingDetails.userTypeOther || 'Not specified'}`
                        : userTypeOptions.find(ut => ut.value === selectedBookingDetails.userType)?.label || 'Not specified'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">Department</Typography>
                    <Typography variant="body1" gutterBottom>
                      {departmentOptions.find(d => d.value === selectedBookingDetails.department)?.label || 'Not specified'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">Current Status</Typography>
                    <Box sx={{ mt: 1 }}>
                      {renderStatusChip(selectedBookingDetails.status)}
                    </Box>
                  </Box>
                </Grid>
                
                {/* Right column */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Scheduling Details
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">Preferred Date</Typography>
                    <Typography variant="body1" gutterBottom>
                      {formatDate(selectedBookingDetails.preferredDate)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">Preferred Time Slot</Typography>
                    <Typography variant="body1" gutterBottom>
                      {getTimeSlotLabel(selectedBookingDetails.preferredTimeSlot)}
                    </Typography>
                  </Box>
                  
                  {selectedBookingDetails.actualDate && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary">Allocated Date</Typography>
                      <Typography variant="body1" gutterBottom sx={{ color: 'success.main', fontWeight: 'bold' }}>
                        {formatDate(selectedBookingDetails.actualDate)}
                      </Typography>
                    </Box>
                  )}
                  
                  {selectedBookingDetails.actualTimeRange && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary">Allocated Time Slot</Typography>
                      <Typography variant="body1" gutterBottom sx={{ color: 'success.main', fontWeight: 'bold' }}>
                        {formatTimeRange(selectedBookingDetails.actualTimeRange)}
                      </Typography>
                    </Box>
                  )}
                  
                  {(selectedBookingDetails.status === 'approved' || selectedBookingDetails.status === 'rejected') && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" color="text.secondary">Feedback</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedBookingDetails.status === 'approved' && selectedBookingDetails.approvalNotes
                          ? selectedBookingDetails.approvalNotes
                          : selectedBookingDetails.status === 'rejected' && selectedBookingDetails.rejectionReason
                          ? selectedBookingDetails.rejectionReason
                          : 'No feedback provided'}
                      </Typography>
                    </Box>
                  )}
                </Grid>
                
                {/* Project Information */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mt: 3 }}>
                    Project Information
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">Project Code and Name</Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedBookingDetails.projectCodeName || 'Not specified'}
                    </Typography>
                  </Box>
                </Grid>
                
                {/* Sample Information */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mt: 1 }}>
                    Sample Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Sample Type</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedBookingDetails.sampleType || 'Not specified'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Sample History</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedBookingDetails.sampleHistory || 'Not specified'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                
                {/* Work Description */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mt: 1 }}>
                    Work Details
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedBookingDetails.description || 'Not specified'}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">Additional Remarks</Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedBookingDetails.additionalRemarks || 'None'}
                    </Typography>
                  </Box>
                </Grid>
                
                {/* Approval History */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mt: 1 }}>
                    Approval History
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">Faculty Approval</Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedBookingDetails.approvalStatus.faculty === 'approved' 
                        ? 'Approved by faculty' 
                        : selectedBookingDetails.approvalStatus.faculty === 'rejected' 
                        ? 'Rejected by faculty' 
                        : 'Pending faculty approval'}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary">Admin Approval</Typography>
                    <Typography variant="body1" gutterBottom>
                      {selectedBookingDetails.approvalStatus.admin === 'approved' 
                        ? 'Approved by admin' 
                        : selectedBookingDetails.approvalStatus.admin === 'rejected' 
                        ? 'Rejected by admin' 
                        : 'Pending admin approval'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails} color="primary">Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Tabs */}
      <Paper 
        elevation={2} 
        sx={{ 
          mb: 4, 
          borderRadius: 2,
          overflow: 'hidden' 
        }}
      >
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'rgba(0, 102, 179, 0.03)'
          }}
        >
          <Tab 
            label="My Bookings" 
            icon={<CalendarIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="New Booking" 
            icon={<AddIcon />} 
            iconPosition="start"
          />
        </Tabs>
        
        {/* Tab content */}
        <Box sx={{ p: 3 }}>
          {/* My Bookings Tab */}
          {tabValue === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Pending Requests
              </Typography>
              {renderBookingsTable(studentBookings.filter(booking => 
                booking.status === 'pending' || 
                booking.status === 'pending_faculty' || 
                booking.status === 'pending_admin'
              ))}
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h6" gutterBottom>
                Approved Bookings
              </Typography>
              {renderBookingsTable(studentBookings.filter(booking => booking.status === 'approved'))}
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h6" gutterBottom>
                Rejected Requests
              </Typography>
              {renderBookingsTable(studentBookings.filter(booking => booking.status === 'rejected'))}
            </Box>
          )}
          
          {/* New Booking Tab */}
          {tabValue === 1 && (
            <Box>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{
                  fontWeight: 600,
                  mb: 3
                }}
              >
                Book Cleanroom Equipment
              </Typography>
              
              {/* Stepper */}
              <Stepper 
                activeStep={activeStep} 
                sx={{ 
                  mb: 4,
                  py: 2
                }}
              >
                <Step>
                  <StepLabel>Information</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Date & Time</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Description</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Confirm</StepLabel>
                </Step>
              </Stepper>
              
              {/* Step content */}
              <Paper 
                elevation={0} 
                variant="outlined"
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  borderColor: 'divider'
                }}
              >
                {renderStepContent(activeStep)}
                
                {/* Navigation buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mt: 3
                }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    variant="outlined"
                  >
                    Back
                  </Button>
                  
                  {activeStep === 3 ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={formLoading}
                    >
                      {formLoading ? 'Submitting...' : 'Submit Booking'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Paper>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Student;
