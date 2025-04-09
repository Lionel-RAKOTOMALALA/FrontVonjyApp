import React, { useState } from 'react'
import TableView from '../../components/ui-table/TableView'
import CollapsibleTable from '../../components/ui-table/CollapsibleTable' // Assurez-vous que le chemin est correct

function table() {
    // Données fictives des chauffeurs
    const data = [
      { id: 1, nom: 'Rasoanaivo', prenom: 'Hery' },
      { id: 2, nom: 'Rakotoarivelo', prenom: 'Naina' },
      { id: 3, nom: 'Andrianarivo', prenom: 'Mamy' },
      { id: 4, nom: 'Ravelojaona', prenom: 'Lova' }, 
      { id: 6, nom: 'Andriantsitohaina', prenom: 'Tiana' },
      { id: 7, nom: 'xxx', prenom: 'Tiana' },
    ];
     
    const columns = [ 
      { id: 'nom', label: 'Nom', render: (row) => row.nom },
      { id: 'prenom', label: 'Prénom', render: (row) => row.prenom }
    ];

    // Conversion des colonnes au format attendu par CollapsibleTable
    const collapsibleColumns = [
      { field: 'id', label: 'Id', align: 'center' },
      { field: 'nom', label: 'Nom' },
      { field: 'prenom', label: 'Prénom' },
    ];

    // Définition des colonnes pour les données détaillées
    const detailColumns = [
      { field: 'date', label: 'Date', align: 'center' },
      { field: 'trajet', label: 'Trajet' },
      { field: 'vehicule', label: 'Véhicule' },
      { field: 'statut', label: 'Statut' }
    ];

    // Fonction pour récupérer les données détaillées pour chaque chauffeur
    const getDetailData = (row) => {
      // Simule les trajets effectués par chaque chauffeur
      const trajetsMap = {
        1: [
          { date: '05/04/2025', trajet: 'Tana - Antsirabe', vehicule: 'Toyota Hiace', statut: 'Terminé' },
          { date: '03/04/2025', trajet: 'Tana - Majunga', vehicule: 'Toyota Coaster', statut: 'Terminé' }
        ],
        2: [
          { date: '06/04/2025', trajet: 'Tana - Fianarantsoa', vehicule: 'Mazda BT-50', statut: 'En cours' },
          { date: '01/04/2025', trajet: 'Tana - Toamasina', vehicule: 'Toyota Hiace', statut: 'Terminé' },
          { date: '28/03/2025', trajet: 'Tana - Antsirabe', vehicule: 'Toyota Coaster', statut: 'Terminé' }
        ],
        3: [
          { date: '04/04/2025', trajet: 'Tana - Morondava', vehicule: 'Toyota Land Cruiser', statut: 'Terminé' }
        ],
        4: [],
        5: [
          { date: '07/04/2025', trajet: 'Tana - Diego', vehicule: 'Toyota Coaster', statut: 'Planifié' },
          { date: '02/04/2025', trajet: 'Tana - Tuléar', vehicule: 'Toyota Hiace', statut: 'Terminé' }
        ],
        6: [
          { date: '06/04/2025', trajet: 'Tana - Antsirabe', vehicule: 'Toyota Hiace', statut: 'Terminé' },
          { date: '30/03/2025', trajet: 'Tana - Fort-Dauphin', vehicule: 'Toyota Land Cruiser', statut: 'Terminé' }
        ]
      };
      
      return trajetsMap[row.id] || [];
    };

    const [expandedRows, setExpandedRows] = useState({
      1: true, 
    });

  return (
    <>
      <h5 className="card-header">Tables</h5> 
      {/* Primary */}
      <div className="card-body d-flex flex-column">
        <small className="text-light fw-medium">Basic</small>
        <div className="demo-inline-spacing col-lg-10 col-12 align-self-center">
          <TableView
            data={data}
            columns={columns} 
            rowsPerPage={5} 
            showCheckboxes={true} 
          /> 
        </div>
      </div>
      <hr className="m-0"></hr> 
      <div className="card-body">
        <small className="text-light fw-medium">Collapsible table</small>
        <div className="demo-inline-spacing">
          <CollapsibleTable
            columns={collapsibleColumns}
            rows={data}
            getDetailData={getDetailData}
            detailColumns={detailColumns}
            detailTitle="Historique des trajets"
            arrowPosition="left"
            expandedRows={expandedRows}
          />
        </div>
      </div> 
    </>
  )
}

export default table