import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Divider
} from '@mui/material';
import { H4 } from '../../components/ui/TypographyVariants';
import { motion } from "framer-motion";
import CollapsibleTable from '../../components/ui-table/CollapsibleTable';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PeopleIcon from '@mui/icons-material/People';

const getServiceIcon = (serviceName) => {
  if (serviceName.toLowerCase().includes('santé')) return <LocalHospitalIcon color="primary" />;
  if (serviceName.toLowerCase().includes('éduc')) return <SchoolIcon color="primary" />;
  if (serviceName.toLowerCase().includes('sécurité')) return <WorkIcon color="primary" />;
  if (serviceName.toLowerCase().includes('agricole')) return <LocationCityIcon color="primary" />;
  return <PeopleIcon color="primary" />;
};

const CommuneDetailsCard = ({ selectedCommune }) => {
  const [communeDetails, setCommuneDetails] = useState(null);

  useEffect(() => {
    if (selectedCommune?.nom) {
      fetch('/exempleData.json')
        .then(res => res.json())
        .then(data => {
          if (data.nomCommune === selectedCommune.nom) {
            setCommuneDetails(data);
          } else {
            setCommuneDetails(null);
          }
        })

        .catch(() => {
          setCommuneDetails(null);
        });
    }
  }, [selectedCommune]);


  if (!selectedCommune) return null;

  const fokotanyColumns = [
    { field: 'nomFokotany', label: 'Nom du Fokotany' },
    { field: 'nombreResponsables', label: 'Responsables', align: 'center' },
    { field: 'nombreServices', label: 'Services', align: 'center' }
  ];

  const responsableColumns = [
    { field: 'classe_responsable', label: 'Rôle' },
    { field: 'nom_complet', label: 'Nom' },
    { field: 'fonction', label: 'Fonction' },
    { field: 'formation', label: 'Formation' }
  ];

  const serviceColumns = [
    { field: 'nomService', label: 'Service' },
    { field: 'description', label: 'Description' },
    { field: 'offre', label: 'Offre' },
    { field: 'membre', label: 'Membres' },
    { field: 'nombre_membre', label: 'Nombre', align: 'center' }
  ];

  const prepareTableData = () => {
    if (!communeDetails) return [];

    return communeDetails.fokotanys.map(fokotany => ({
      id: fokotany.id,
      nomFokotany: fokotany.nomFokotany,
      nombreResponsables: fokotany.responsable.length,
      nombreServices: fokotany.services.length,
      responsables: fokotany.responsable.map(resp => ({
        ...resp,
        nom_complet: `${resp.prenom_responsable} ${resp.nom_responsable}`,
        formation: resp.formation_acquise ? 'Formé' : 'Non formé'
      })),
      services: fokotany.services
    }));
  };

  const detailTables = [
    {
      title: "Responsables du Fokotany",
      columns: responsableColumns,
      getData: (row) => row.responsables || []
    },
    {
      title: "Services disponibles",
      columns: serviceColumns,
      getData: (row) => row.services || []
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <Box className="row mt-4">
        <Box className="col-12">
          <Card elevation={3} sx={{ borderRadius: 5, overflow: "hidden", bgcolor: "#fff", boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <CardContent>  
              {communeDetails ? (
                <Box sx={{ mt: 3 }}>
                  <H4 sx={{ mb: 2 }}>Fokotany de {selectedCommune.nom}</H4>
                  <CollapsibleTable
                    columns={fokotanyColumns}
                    rows={prepareTableData()}
                    detailTables={detailTables}
                    arrowPosition="left"
                  />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column' }}>
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
