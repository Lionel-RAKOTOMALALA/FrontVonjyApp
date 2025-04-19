import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CommuneIcon from '../../../../assets/icons/commune.svg';
import FokotanyIcon from '../../../../assets/icons/fokotany.svg';
import ServiceIcon from '../../../../assets/icons/service.svg';

const StatistiqueGlobal = ({ selectedCommune }) => {
  const [communeData, setCommuneData] = useState(null);

  useEffect(() => {
    fetch('/exempleData.json')
      .then(res => res.json())
      .then(data => setCommuneData(data))
      .catch(err => console.error('Erreur chargement JSON:', err));
  }, []);

  const cardBodyStyle = {
    backgroundImage: 'none',
    position: 'relative',
    zIndex: '0',
    padding: '24px 20px',
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

  // Dégradés linéaires pour les fonds des SVG
  const gradients = {
    commune: 'linear-gradient(322deg,rgba(255, 94, 94, 0.49) 0%, rgba(255, 255, 255, 1) 100%)',
    service: 'linear-gradient(322deg,rgba(255, 248, 225, 1) 0%, rgba(255, 220, 125, 0.80) 100%)',
    fokotany: 'linear-gradient(322deg,rgba(227, 247, 236, 1) 0%, rgba(150, 255, 192, 0.50) 78%)'
  };

  // Valeurs par défaut
  let communeCount = 15;
  let fokotanyCount = 40;
  let serviceCount = 15;

  if (selectedCommune && communeData) {
    if (communeData.nomCommune === selectedCommune.nom) {
      communeCount = 1;
      fokotanyCount = communeData.fokotanys.length;

      const allServiceIds = communeData.fokotanys.flatMap(f =>
        f.services.map(s => s.id)
      );

      serviceCount = new Set(allServiceIds).size;
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <AnimatePresence mode="wait">
      {!selectedCommune ? (
        <motion.div
          key="district-view"
          initial="hidden"
          animate="visible"
          exit="exit"
          className="row gap-3 mb-4 justify-content-center justify-content-md-start"
        >
          <motion.div variants={cardVariants} className='col-12 col-md-9' transition={{ duration: 0.3 }}>
            <div className="card" style={{minWidth:'190px'}} >
              <div className="card-body" style={cardBodyStyle}>
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={CommuneIcon}
                    width={35}
                    height={35}
                    style={{ marginRight: "20px", marginLeft: "25px", position: "absolute", right: 0 }}
                  />
                  <h3 className="card-title fw-bold mb-0 mt-1">{communeCount}</h3>
                </div>
                <p className="mb-0">Communes</p>
                <div style={{ ...svgStyle, backgroundImage: gradients.commune }}></div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={cardVariants}  className='col-12 col-md-9' transition={{ duration: 0.3, delay: 0.1 }}>
            <div className="card" style={{minWidth:'190px'}} >
              <div className="card-body" style={cardBodyStyle}>
                <img
                  src={ServiceIcon}
                  width={35}
                  height={35}
                  style={{ marginRight: "20px", marginLeft: "25px", position: "absolute", right: 0 }}
                />
                <h3 className="card-title fw-bold mb-0 mt-1">{serviceCount}</h3>
                <p className="mb-1">Services</p>
                <div style={{ ...svgStyle, backgroundImage: gradients.service }}></div>
              </div>
            </div>
          </motion.div>
          <motion.div variants={cardVariants}  className='col-12 col-md-9' transition={{ duration: 0.3, delay: 0.2 }}>
            <div className="card" style={{minWidth:'190px'}} >
              <div className="card-body" style={cardBodyStyle}>
                <img
                  src={FokotanyIcon}
                  width={35}
                  height={35}
                  style={{ marginRight: "20px", marginLeft: "25px", position: "absolute", right: 0 }}
                />
                <h3 className="card-title fw-bold mb-0 mt-1">{fokotanyCount}</h3>
                <p className="mb-1">Total fokontany</p>
                <div style={{ ...svgStyle, backgroundImage: gradients.fokotany }}></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="commune-view"
          initial="hidden"
          animate="visible"
          exit="exit"
          className="row gap-3 mb-4"
        >

          <motion.div variants={cardVariants}  className='col-12 col-md-9' transition={{ duration: 0.3 }}>
            <div className="card" style={{minWidth:'190px'}} >
              <div className="card-body" style={cardBodyStyle}>
                <img
                  src={FokotanyIcon}
                  width={35}
                  height={35}
                  style={{ marginRight: "20px", marginLeft: "25px", position: "absolute", right: 0 }}
                />
                <h3 className="card-title fw-bold mb-0 mt-1">{fokotanyCount}</h3>
                <p className="mb-1">Fokontany</p>
                <div style={{ ...svgStyle, backgroundImage: gradients.fokotany }}></div>
              </div>
            </div>
          </motion.div>
          <motion.div variants={cardVariants}  className='col-12 col-md-9' transition={{ duration: 0.3, delay: 0.1 }} >
            <div className="card" style={{minWidth:'190px'}} >
              <div className="card-body" style={cardBodyStyle}>
                <img
                  src={ServiceIcon}
                  width={35}
                  height={35}
                  style={{ marginRight: "20px", marginLeft: "25px", position: "absolute", right: 0 }}
                />
                <h3 className="card-title fw-bold mb-0 mt-1">{serviceCount}</h3>
                <p className="mb-1">Services</p>
                <div style={{ ...svgStyle, backgroundImage: gradients.service }}></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatistiqueGlobal;
