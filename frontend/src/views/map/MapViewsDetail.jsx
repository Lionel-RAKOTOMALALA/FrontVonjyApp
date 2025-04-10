import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import CommuneIcon from '../../assets/icons/commune.svg';
import ServiceIcon from '../../assets/icons/service.svg';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Card,
    CardContent,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    Grid,
    Button,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    TableContainer,
    Paper,
    CircularProgress,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate, useParams } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import CustomButton from '../../components/ui/CustomButton';
import { H2, H3, Paragraphe, Subtitle1 } from '../../components/ui/TypographyVariants';
import AmpanihyData from './Ampanihy.json';
import { calculateBBox } from './MapUtils'; // Import calculateBBox

// StatCard Component (No changes needed)
const StatCard = ({ icon, title, value }) => (
    <Box sx={{
        mt: 4,
        p: 2,
        border: '1px solid #ddd',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        width: '60%'
    }}>
        <img
            src={icon}
            width={40}
            height={40}
            alt={title}
            style={{ marginRight: "20px", marginLeft: "25px" }}
            aria-hidden="true"
        />
        <Box>
            <Paragraphe>{title}</Paragraphe>
            <H3>{value}</H3>
        </Box>
    </Box>
);

StatCard.propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

// FlyToBounds Component (to fit map to the commune)
function FlyToBounds({ communeData }) {
    const map = useMap();

    useEffect(() => {
        if (communeData && communeData.geometry && communeData.geometry.coordinates) {
            const bounds = calculateBBox({ features: [communeData] }); // Wrap in features array
            if (bounds) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [communeData, map]);

    return null;
}

FlyToBounds.propTypes = {
    communeData: PropTypes.object,
};

const MapViewsDetail = () => {
    const { name } = useParams();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [mapError, setMapError] = useState(null);
    const [commune, setCommune] = useState(null); // State to hold the found commune
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const services = [
        { type: 'Ecole', nombre: 20, details: 'Couverture éducative faible' },
        { type: 'CSB2', nombre: 10, details: 'Couverture santé faible' },
        { type: 'Police', nombre: 1, details: 'Sécurité' },
    ];

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // Handle scroll for app bar effect (No changes needed)
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Find the commune and validate data
    useEffect(() => {
        setLoading(true);
        try {
            if (!AmpanihyData?.features) {
                throw new Error('Invalid GeoJSON data structure');
            }

            const foundCommune = AmpanihyData.features.find(
              (f) => f.properties.District_N?.toLowerCase() === name.toLowerCase() // Safe access with optional chaining
            );

            if (!foundCommune) {
                throw new Error(`Commune "${name}" non trouvée`);
            }

            setCommune(foundCommune); // Set the commune in state
            setLoading(false);
        } catch (error) {
            setMapError(error.message);
            setLoading(false);
        }
    }, [name]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (mapError) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center', p: 2 }}>
                <Typography variant="h6" color="error">{mapError}</Typography>
            </Box>
        );
    }

    if (!commune) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h5">Commune "{name}" non trouvée</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, bgcolor: '#f9f9f9', minHeight: '100vh', mt: '64px' }}>
            {/* Top Bar (No changes needed) */}
            <AppBar
                position="fixed"
                sx={{
                    bgcolor: isScrolled ? 'rgba(255, 255, 255, 0.7)' : '#ffffff',
                    color: '#000',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    backdropFilter: isScrolled ? 'blur(10px)' : 'none',
                    transition: 'all 0.3s ease',
                    zIndex: 1201,
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box display="flex" alignItems="center">
                        <img
                            src="/logo.png"
                            alt="Centre Vonjy Logo"
                            style={{ height: 40, marginRight: 10 }}
                        />
                        <Typography variant="h5" fontWeight="bold">
                            Centre Vonjy
                        </Typography>
                    </Box>

                    <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" sx={{ marginRight: 1 }}>
                            bryan@gmail.com
                        </Typography>
                        <IconButton
                            onClick={handleMenuClick}
                            aria-label="User menu"
                            aria-controls="user-menu"
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Avatar sx={{ bgcolor: '#fbc02d' }}>B</Avatar>
                            <ArrowDropDownIcon />
                        </IconButton>
                        <Menu
                            id="user-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            MenuListProps={{
                                'aria-labelledby': 'user-menu',
                            }}
                        >
                            <MenuItem onClick={handleClose}>Paramètres</MenuItem>
                            <MenuItem onClick={handleClose}>Voir profil</MenuItem>
                            <Divider />
                            <MenuItem onClick={handleClose}>Déconnexion</MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Header with back button and PDF export (No significant changes) */}
            <Box sx={{ padding: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                {/* Back button */}
                <Box display="flex" alignItems="center" flex="1">
                    <IconButton onClick={() => navigate("/map")} aria-label="Retour">
                        <ArrowBackIosIcon />
                    </IconButton>
                </Box>

                {/* Centered title */}
                <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                    <H2>District d'Ampanihy</H2>
                </Box>

                {/* PDF button on the right */}
                <Box flex="1" display="flex" justifyContent="flex-end">
                    <CustomButton variant="contained" color="warning">
                        <Paragraphe>Exporter PDF</Paragraphe>
                    </CustomButton>
                </Box>
            </Box>

            {/* Map and Statistics Cards */}
            <Grid container spacing={4} px={3}>
                <Grid item xs={12} md={7}>
                    <Card sx={{ borderRadius: 4, height: '100%' }}>
                        <CardContent>
                            <Subtitle1 fontWeight="bold" textAlign="center">
                            Carte de {commune?.properties?.District_N}
                            </Subtitle1>
                            <Paragraphe textAlign="center">
                                vue géographique détaillée
                            </Paragraphe>
                            <Box sx={{ mt: 2, height: 350, borderRadius: 2, overflow: 'hidden', border: '1px solid #ddd' }}>
                                <MapContainer
                                    style={{ height: '100%', width: '100%' }}
                                    aria-label={`Carte de la commune ${name}`}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <GeoJSON data={commune} />
                                    <FlyToBounds communeData={commune} />
                                </MapContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={5}>
                    <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
                        <CardContent>
                            <Subtitle1 fontWeight="bold" textAlign="center">
                                Statistiques
                            </Subtitle1>
                            <Paragraphe textAlign="center">
                                Infrastructures et services
                            </Paragraphe>

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                                <StatCard
                                    icon={CommuneIcon}
                                    title="Fokontany"
                                    value={40} // Placeholder - Replace with dynamic data if available
                                />
                                <StatCard
                                    icon={ServiceIcon}
                                    title="Services"
                                    value={42} // Placeholder - Replace with dynamic data if available
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Services Details Table (No significant changes) */}
            <Box px={3} py={4}>
                <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
                    <CardContent>
                        <Subtitle1 fontWeight="bold" textAlign="center" gutterBottom>
                            Détails des Services
                        </Subtitle1>
                        <Paragraphe textAlign="center" gutterBottom>
                            Analyse détaillée des infrastructures
                        </Paragraphe>
                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Détails</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {services.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{row.type}</TableCell>
                                            <TableCell>{row.nombre}</TableCell>
                                            <TableCell>{row.details}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default MapViewsDetail;