import React, { useState } from 'react';
import { 
  Box, Card, CardContent, Typography, Accordion, AccordionSummary, 
  AccordionDetails, Chip, Divider, List, ListItem, ListItemText, ListItemIcon 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { H4,  Subtitle1 } from '../../components/ui/TypographyVariants';
import { motion } from "framer-motion";

// Données simulées des fokotany et services
// Ceci pourrait être remplacé par des données réelles provenant d'une API ou d'un fichier JSON
const communeDetailsMock = {
  "Ampanihy": {
    "id": 1,
    "nomCommune": "Ampanihy",
    "fokotanys": [
      {
        "id": 1,
        "nomFokotany": "Ankadifotsy",
        "classe_responsable": "Classe A",
        "nom_responsable": "Rakoto",
        "prenom_responsable": "Jean",
        "fonction": "Chef Fokotany",
        "formation_acquise": "BAC+3",
        "services": [
          {
            "id": 1,
            "nomService": "Centre de santé communautaire",
            "description": "Fournit des soins de santé de base à la population locale.",
            "offre": "Consultation, vaccination, sensibilisation",
            "membre": "Docteur Rasoanaivo, Infirmier Rakoto, Sage-femme Ralaivola",
            "nombre_membre": 5
          }
        ]
      },
      {
        "id": 2,
        "nomFokotany": "Ambohimasina",
        "classe_responsable": "Classe B",
        "nom_responsable": "Ravelo",
        "prenom_responsable": "Marie",
        "fonction": "Chef Fokotany",
        "formation_acquise": "BAC",
        "services": [
          {
            "id": 2,
            "nomService": "Éducation communautaire",
            "description": "Appui scolaire pour les enfants défavorisés.",
            "offre": "Cours du soir, alphabétisation, aide aux devoirs",
            "membre": "Professeur Randria, Volontaire Fanja",
            "nombre_membre": 3
          }
        ]
      },
      {
        "id": 3,
        "nomFokotany": "Andranomena",
        "classe_responsable": "Classe C",
        "nom_responsable": "Andrianina",
        "prenom_responsable": "Hery",
        "fonction": "Chef Fokotany",
        "formation_acquise": "CAP",
        "services": [
          {
            "id": 3,
            "nomService": "Sécurité locale",
            "description": "Assure la sécurité de la population.",
            "offre": "Patrouille, médiation, sensibilisation",
            "membre": "Agent Ramamy, Volontaire Solo",
            "nombre_membre": 4
          }
        ]
      },
      {
        "id": 4,
        "nomFokotany": "Ambalavato",
        "classe_responsable": "Classe A",
        "nom_responsable": "Rasoa",
        "prenom_responsable": "Claudine",
        "fonction": "Chef Fokotany",
        "formation_acquise": "BAC+2",
        "services": [
          {
            "id": 4,
            "nomService": "Développement agricole",
            "description": "Soutien aux agriculteurs locaux.",
            "offre": "Formation, distribution de semences, aide technique",
            "membre": "Ingénieur agronome Tovo, Technicien Faly",
            "nombre_membre": 4
          }
        ]
      },
      {
        "id": 5,
        "nomFokotany": "Mahatsinjo",
        "classe_responsable": "Classe B",
        "nom_responsable": "Randria",
        "prenom_responsable": "Tiana",
        "fonction": "Chef Fokotany",
        "formation_acquise": "BAC+1",
        "services": [
          {
            "id": 5,
            "nomService": "Assainissement",
            "description": "Gestion des déchets et hygiène publique.",
            "offre": "Collecte d'ordures, éducation sanitaire, entretien des latrines",
            "membre": "Chef d'équipe Liva, Agent Fitiavana",
            "nombre_membre": 6
          }
        ]
      }
    ]
  },
  // Ajoutez d'autres communes selon le même modèle...
};

// Fonction pour obtenir un icône en fonction du nom du service
const getServiceIcon = (serviceName) => {
  if (serviceName.toLowerCase().includes('santé')) return <LocalHospitalIcon color="primary" />;
  if (serviceName.toLowerCase().includes('éduc')) return <SchoolIcon color="primary" />;
  if (serviceName.toLowerCase().includes('sécurité')) return <WorkIcon color="primary" />;
  if (serviceName.toLowerCase().includes('agricole')) return <LocationCityIcon color="primary" />;
  return <PeopleIcon color="primary" />;
};

const CommuneDetailsCard = ({ selectedCommune }) => {
  const [expandedFokotany, setExpandedFokotany] = useState(false);
  
  // Si pas de commune sélectionnée, retourner null
  if (!selectedCommune) return null;
  
  // Récupérer les détails simulés de la commune
  const communeDetails = communeDetailsMock[selectedCommune.nom] || null;
  
  const handleFokotanyChange = (fokotanyId) => (event, isExpanded) => {
    setExpandedFokotany(isExpanded ? fokotanyId : false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="row mt-4">
        <Box className="col-12">
          <Card elevation={3} sx={{ 
            borderRadius: 2, 
            overflow: "hidden",
            bgcolor: "#fff",
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <H4 sx={{ color: 'primary.main', mb: 1 }}>Détails de la Commune</H4>
                <Divider sx={{ mb: 2 }} />
                
                <Box className="row">
                  <Box className="col-md-3 mb-3">
                    <Typography variant="subtitle2" color="text.secondary">Nom</Typography>
                    <Typography variant="body1" fontWeight="medium">{selectedCommune.nom}</Typography>
                  </Box>
                  <Box className="col-md-3 mb-3">
                    <Typography variant="subtitle2" color="text.secondary">Population</Typography>
                    <Typography variant="body1" fontWeight="medium">{selectedCommune.population}</Typography>
                  </Box>
                  <Box className="col-md-3 mb-3">
                    <Typography variant="subtitle2" color="text.secondary">Superficie</Typography>
                    <Typography variant="body1" fontWeight="medium">{selectedCommune.superficie} km²</Typography>
                  </Box>
                  <Box className="col-md-3 mb-3">
                    <Typography variant="subtitle2" color="text.secondary">Nombre de fokotany</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {communeDetails ? communeDetails.fokotanys.length : selectedCommune.fokotany}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {communeDetails && (
                <Box sx={{ mt: 3 }}>
                  <H4 sx={{ mb: 2 }}>Fokotany de {selectedCommune.nom}</H4>
                  
                  {communeDetails.fokotanys.map((fokotany) => (
                    <Accordion 
                      key={fokotany.id}
                      expanded={expandedFokotany === fokotany.id}
                      onChange={handleFokotanyChange(fokotany.id)}
                      sx={{ 
                        mb: 2, 
                        borderRadius: '8px !important',
                        '&:before': { display: 'none' },
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{ 
                          borderRadius: '8px',
                          bgcolor: 'rgba(0, 0, 0, 0.02)',
                          '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <Typography fontWeight="medium">{fokotany.nomFokotany}</Typography>
                          <Chip 
                            label={fokotany.classe_responsable} 
                            size="small" 
                            color={
                              fokotany.classe_responsable === "Classe A" ? "success" :
                              fokotany.classe_responsable === "Classe B" ? "primary" : "warning"
                            } 
                            sx={{ ml: 2 }} 
                          />
                        </Box>
                      </AccordionSummary>
                      
                      <AccordionDetails sx={{ pt: 3 }}>
                        <Box className="row mb-3">
                          <Box className="col-md-6">
                            <Typography variant="subtitle2" color="text.secondary">Responsable</Typography>
                            <Typography variant="body1">{fokotany.prenom_responsable} {fokotany.nom_responsable}</Typography>
                          </Box>
                          <Box className="col-md-3">
                            <Typography variant="subtitle2" color="text.secondary">Fonction</Typography>
                            <Typography variant="body1">{fokotany.fonction}</Typography>
                          </Box>
                          <Box className="col-md-3">
                            <Typography variant="subtitle2" color="text.secondary">Formation</Typography>
                            <Typography variant="body1">{fokotany.formation_acquise}</Typography>
                          </Box>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Subtitle1 sx={{ mb: 2 }}>Services disponibles</Subtitle1>
                        
                        {fokotany.services.map((service) => (
                          <Card 
                            key={service.id} 
                            variant="outlined" 
                            sx={{ mb: 2, borderRadius: 2 }}
                          >
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                {getServiceIcon(service.nomService)}
                                <Box sx={{ ml: 2 }}>
                                  <Typography variant="h6" fontWeight="medium">{service.nomService}</Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{service.description}</Typography>
                                </Box>
                              </Box>
                              
                              <List dense sx={{ mt: 1 }}>
                                <ListItem>
                                  <ListItemText 
                                    primary="Offres" 
                                    secondary={service.offre} 
                                    primaryTypographyProps={{ variant: 'subtitle2', color: 'text.secondary' }}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText 
                                    primary="Membres" 
                                    secondary={service.membre} 
                                    primaryTypographyProps={{ variant: 'subtitle2', color: 'text.secondary' }}
                                  />
                                </ListItem>
                                <ListItem>
                                  <ListItemText 
                                    primary="Nombre de membres" 
                                    secondary={service.nombre_membre} 
                                    primaryTypographyProps={{ variant: 'subtitle2', color: 'text.secondary' }}
                                  />
                                </ListItem>
                              </List>
                            </CardContent>
                          </Card>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
              
              {/* Message si les données détaillées ne sont pas disponibles */}
              {!communeDetails && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '200px', 
                  flexDirection: 'column' 
                }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Les données détaillées pour cette commune ne sont pas encore disponibles.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </motion.div>
  );
};

export default CommuneDetailsCard;