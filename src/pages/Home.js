import React, { useContext } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  Chip,
  Stack,
  CardMedia
} from '@mui/material';
import { 
  AccessTime as ClockIcon, 
  Science as ScienceIcon, 
  School as SchoolIcon,
  ChevronRight as ChevronRightIcon,
  Person as PersonIcon,
  SupervisorAccount as FacultyIcon,
  AdminPanelSettings as AdminIcon,
  Biotech as BiotechIcon,
  SquareFoot as SquareFootIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Completely removing lab image references as requested
// No images needed on homepage for now

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero Section with Gradient Background */}
      <Box 
        sx={{ 
          py: 8, 
          background: 'linear-gradient(135deg, #0062cc 0%, #0096c7 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  position: 'relative',
                  zIndex: 2
                }}
              >
                BITS Pilani Hyderabad Campus
              </Typography>
              <Typography 
                variant="h3" 
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                  position: 'relative',
                  zIndex: 2
                }}
              >
                Clean Room Micro and Nano Fabrication Facility
              </Typography>
              <Typography 
                variant="h6" 
                sx={{
                  mb: 4,
                  maxWidth: 600,
                  lineHeight: 1.6,
                  position: 'relative',
                  zIndex: 2,
                  opacity: 0.9
                }}
              >
                State-of-the-art facilities for micro and nano semiconductor device fabrication and characterization
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4, position: 'relative', zIndex: 2 }}>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  size="large"
                  onClick={() => navigate('/student/login')}
                  endIcon={<PersonIcon />}
                  sx={{
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Student Login
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/faculty/login')}
                  endIcon={<FacultyIcon />}
                  sx={{
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Faculty Login
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/admin/login')}
                  endIcon={<AdminIcon />}
                  sx={{
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    color: 'white',
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  Admin Login
                </Button>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  height: 300,
                  width: '100%',
                  backgroundColor: '#0066b3', /* Replaced image with BITS Pilani blue color */
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 3,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  position: 'relative',
                  zIndex: 2,
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.1)',
                    zIndex: 1
                  }
                }}
              />
            </Grid>
          </Grid>
          
          {/* Decorative elements */}
          <Box
            sx={{
              position: 'absolute',
              bottom: '-50px',
              right: '-50px',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
              zIndex: 1
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50px',
              left: '-100px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
              zIndex: 1
            }}
          />
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Facility Info Section */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12}>
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{
                mb: 4,
                fontWeight: 700,
                position: 'relative',
                paddingBottom: 2,
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 80,
                  height: 4,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 2
                }
              }}
            >
              About the Facility
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                Cleanroom Specifications
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 3 }}>
                <SquareFootIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                <Typography variant="body1">
                  <strong>Size:</strong> 581 sq. ft facility
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ScienceIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                <Typography variant="body1">
                  <strong>Classification:</strong> 80% maintained as ISO 6 (class 1000) and 20% as ISO 5 (class 100)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BiotechIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                <Typography variant="body1">
                  <strong>Special Area:</strong> Class 100 area covered with yellow light dedicated for Lithography process
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mt: 3 }}>
                The facility is designed to provide a controlled environment for micro and nano semiconductor device fabrication and characterization, supporting cutting-edge research and academic projects.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                Online Booking System
              </Typography>
              <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                This online booking system allows students, faculty, and researchers to:
              </Typography>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ChevronRightIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  Reserve time slots for specific equipment
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ChevronRightIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  Submit detailed project information
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ChevronRightIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  Receive faculty and admin approval
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ChevronRightIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  Track the status of booking requests
                </Typography>
                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ChevronRightIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  Access equipment usage history
                </Typography>
              </Box>
              <Box sx={{ mt: 3 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  onClick={() => navigate('/student/login')}
                  endIcon={<ChevronRightIcon />}
                  sx={{ fontWeight: 600 }}
                >
                  Get Started
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Equipment Section */}
        <Box sx={{ mb: 6 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{
              mb: 4,
              fontWeight: 700,
              position: 'relative',
              paddingBottom: 2,
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: 80,
                height: 4,
                backgroundColor: theme.palette.primary.main,
                borderRadius: 2
              }
            }}
          >
            Available Equipment
          </Typography>
          
          <Grid container spacing={3}>
            {[
              { title: 'Electron Beam Evaporation', items: ['Electron beam evaporation BC 300', 'Electron bem evaporation AUTO 500'] },
              { title: 'Deposition & Coating', items: ['RF sputter deposition', 'Spin Coater'] },
              { title: 'Lithography', items: ['UV exposure system PCB', 'Mask Aligner', 'Laser Writer'] },
              { title: 'Thermal Processing', items: ['Annealing Furnace', 'Diffusion furnace', 'Hot plate'] },
              { title: 'Etching & Surface Treatment', items: ['Reactive Ion etch system', 'UV Ozone system', 'Wet Station'] },
              { title: 'Measurement & Analysis', items: ['Microscope', 'Probe station 2450', 'Probe station 4200', 'Profilometer', 'Reflectrometer', 'Wire Bonder'] }
            ].map((category, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    height: '100%', 
                    borderRadius: 2, 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: theme.palette.primary.main, mb: 2 }}>
                    {category.title}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {category.items.map((item, idx) => (
                    <Typography key={idx} variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <ChevronRightIcon sx={{ mr: 1, fontSize: '0.9rem', color: theme.palette.primary.main }} />
                      {item}
                    </Typography>
                  ))}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Footer */}
        <Box 
          component={Paper} 
          elevation={0}
          sx={{ 
            p: 4, 
            mt: 6, 
            borderRadius: 2,
            textAlign: 'center',
            backgroundColor: 'rgba(0,0,0,0.02)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}
        >
          <Typography variant="h6" color="primary" gutterBottom fontWeight={600}>
            BITS Pilani Hyderabad Campus
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {new Date().getFullYear()} Clean Room Micro and Nano Fabrication Facility. All rights reserved.
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            For technical support, please contact the lab administrator.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
