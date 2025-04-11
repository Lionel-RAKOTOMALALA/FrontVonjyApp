import React from 'react';
import { motion, AnimatePresence } from "framer-motion";

// Données mockées (importées depuis un fichier séparé ou déclarées ici)
const communeDetailsMock = {
  "Ampanihy": {
    "id": 1,
    "nomCommune": "Ampanihy",
    "fokotanys": [
      {
        "id": 1,
        "nomFokotany": "Ankadifotsy",
        "services": [
          {
            "id": 1,
            "nomService": "Centre de santé communautaire"
          }
        ]
      },
      {
        "id": 2,
        "nomFokotany": "Ambohimasina",
        "services": [
          {
            "id": 2,
            "nomService": "Éducation communautaire"
          }
        ]
      },
      {
        "id": 3,
        "nomFokotany": "Andranomena",
        "services": [
          {
            "id": 3,
            "nomService": "Sécurité locale"
          }
        ]
      },
      {
        "id": 4,
        "nomFokotany": "Ambalavato",
        "services": [
          {
            "id": 4,
            "nomService": "Développement agricole"
          }
        ]
      },
      {
        "id": 5,
        "nomFokotany": "Mahatsinjo",
        "services": [
          {
            "id": 5,
            "nomService": "Assainissement"
          }
        ]
      }
    ]
  },
  // Ajoutez d'autres communes si nécessaire
};

const StatistiqueGlobal = ({ selectedCommune }) => {
  const cardBodyStyle = {
    backgroundImage: 'none',
    position: 'relative',
    zIndex: '0',
    paddingTop: '24px',
    paddingBottom: '24px',
    paddingLeft: '24px',
    paddingRight: '20px',
    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    borderRadius: '16px',
  };

  const svgStyle = {
    top: '-44px',
    width: '160px',
    height: '160px',
    right: '-104px',
    borderRadius: '24px',
    position: 'absolute',
    transform: 'rotate(40deg)',
    zIndex: '-1'
  };

  // Calculer les statistiques en fonction de la commune sélectionnée
  let communeCount = 15; // Valeur par défaut du district
  let fokotanyCount = 40; // Valeur par défaut du district
  let serviceCount = 15; // Valeur par défaut du district

  // Si une commune est sélectionnée, mettre à jour les statistiques
  if (selectedCommune) {
    const communeData = communeDetailsMock[selectedCommune.nom];
    
    if (communeData) {
      communeCount = 1; // Une seule commune sélectionnée
      fokotanyCount = communeData.fokotanys.length;
      
      // Compter les services uniques dans tous les fokotany
      const allServices = [];
      communeData.fokotanys.forEach(fokotany => {
        fokotany.services.forEach(service => {
          allServices.push(service.id);
        });
      });
      
      // Éliminer les doublons pour obtenir le nombre unique de services
      serviceCount = new Set(allServices).size;
    }
  }

  // Variations d'animation pour les cartes
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <AnimatePresence mode="wait">
      {!selectedCommune ? (
        // Vue du district (trois cartes)
        <motion.div 
          key="district-view"
          initial="hidden"
          animate="visible"
          exit="exit"
          className="row gap-3 mb-4"
        >
          <motion.div variants={cardVariants} transition={{ duration: 0.3 }} className="col">
            <div className="card" style={{maxWidth:'240px'}}>
              <div className="card-body" style={cardBodyStyle}>
                <div className="d-flex align-items-center justify-content-between">
                  <h3 className="card-title fw-bold mb-0 mt-1">
                    {communeCount}
                  </h3>
                </div>
                <p className="mb-0">Communes</p>
                <div style={{ ...svgStyle, backgroundColor: 'rgba(255, 0, 0, 0.20)' }}></div>
              </div>
            </div>
          </motion.div>
          <motion.div variants={cardVariants} transition={{ duration: 0.3, delay: 0.1 }} className="">
            <div className="card" style={{maxWidth:'240px'}}>
              <div className="card-body" style={cardBodyStyle}>
                <div className="d-flex align-items-center justify-content-between">
                  <h3 className="card-title fw-bold mb-0 mt-1">
                    {serviceCount}
                  </h3>
                </div>
                <p className="mb-1">Services</p>
                <div style={{ ...svgStyle, backgroundColor: '#FEF0C9' }}></div>
              </div>
            </div>
          </motion.div>
          <motion.div variants={cardVariants} transition={{ duration: 0.3, delay: 0.2 }} className="">
            <div className="card" style={{maxWidth:'240px'}}>
              <div className="card-body" style={cardBodyStyle}>
                <div className="d-flex align-items-center justify-content-between">
                  <h3 className="card-title fw-bold mb-0 mt-1">
                    {fokotanyCount}
                  </h3>
                </div>
                <p className="mb-1">Total fokontany</p>
                <div style={{ ...svgStyle, backgroundColor: '#E6F7ED' }}></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        // Vue de la commune (deux cartes)
        <motion.div 
          key="commune-view"
          initial="hidden"
          animate="visible"
          exit="exit"
          className="row gap-3 mb-4"
        >
          <motion.div variants={cardVariants} transition={{ duration: 0.3 }} className="">
            <div className="card" style={{maxWidth:'240px'}}>
              <div className="card-body" style={cardBodyStyle}>
                <div className="d-flex align-items-center justify-content-between">
                  <h3 className="card-title fw-bold mb-0 mt-1">
                    {fokotanyCount}
                  </h3>
                </div>
                <p className="mb-1">Fokontany</p>
                <div style={{ ...svgStyle, backgroundColor: '#E6F7ED' }}></div>
              </div>
            </div>
          </motion.div>
          <motion.div variants={cardVariants} transition={{ duration: 0.3, delay: 0.1 }} className="">
            <div className="card" style={{maxWidth:'240px'}}>
              <div className="card-body" style={cardBodyStyle}>
                <div className="d-flex align-items-center justify-content-between">
                  <h3 className="card-title fw-bold mb-0 mt-1">
                    {serviceCount}
                  </h3>
                </div>
                <p className="mb-1">Services</p>
                <div style={{ ...svgStyle, backgroundColor: '#FEF0C9' }}></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatistiqueGlobal;