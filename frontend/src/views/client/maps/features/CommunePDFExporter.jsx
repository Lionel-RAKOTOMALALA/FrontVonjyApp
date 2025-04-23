// PDFExporter.js
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import html2canvas from "html2canvas"

/**
 * Utilitaire pour exporter les données des communes et fokotanys en PDF
 */
export const CommunePDFExporter = {
  /**
   * Exporte les données d'une commune et ses fokotanys en PDF
   * @param {Object} communeDetails - Détails de la commune à exporter
   */
  exportCommune: async (communeDetails) => {
    if (!communeDetails) return

    // Création d'un nouveau document PDF
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Titre principal
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.text(`Commune de ${communeDetails.nomCommune}`, pageWidth / 2, 15, { align: "center" })

    // Date d'export
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const today = new Date().toLocaleDateString("fr-FR")
    doc.text(`Date d'exportation: ${today}`, pageWidth - 15, 10, { align: "right" })

    let yPos = 25 // Réduit de 30 à 25

    // Capture et ajout de la carte si la fonction de préparation est disponible
    if (window.prepareMapForExport) {
      try {
        // Préparer une carte spécifique pour l'export
        const exportData = window.prepareMapForExport(communeDetails.id)

        if (exportData) {
          // Attendre que la carte soit complètement chargée
          await new Promise((resolve) => setTimeout(resolve, 800))

          // Capture de la carte avec html2canvas
          const canvas = await html2canvas(exportData.container, {
            useCORS: true,
            scale: 2, // Meilleure qualité
            logging: false,
            allowTaint: true,
            backgroundColor: "#ffffff", // Assurer un fond blanc
          })

          // Conversion du canvas en image
          const mapImgData = canvas.toDataURL("image/png")

          // Calcul des dimensions pour maintenir le ratio et centrer l'image
          const maxWidth = pageWidth - 20 // Marges réduites (de 30 à 20)
          const maxHeight = 120 // Hauteur maximale réduite (de 140 à 120)

          // Calcul des dimensions en préservant le ratio
          let mapWidth, mapHeight
          const imageRatio = canvas.width / canvas.height

          if (canvas.width / canvas.height > maxWidth / maxHeight) {
            // Si l'image est plus large que haute
            mapWidth = maxWidth
            mapHeight = mapWidth / imageRatio
          } else {
            // Si l'image est plus haute que large
            mapHeight = maxHeight
            mapWidth = mapHeight * imageRatio
          }

          // Calcul de la position X pour centrer l'image
          const xPos = (pageWidth - mapWidth) / 2

          // Ajout de l'image au PDF avec une bordure
          doc.setDrawColor(0)
          doc.setLineWidth(0.5)
          doc.rect(xPos - 1, yPos - 1, mapWidth + 2, mapHeight + 2)
          doc.addImage(mapImgData, "PNG", xPos, yPos, mapWidth, mapHeight)

          // Mise à jour de la position Y pour le contenu suivant
          yPos += mapHeight + 5 // Réduit de 10 à 5

          // Ajouter une légende pour la carte
          doc.setFontSize(9) // Taille réduite
          doc.setFont("helvetica", "italic")
          doc.text(`Périmètre de la commune de ${communeDetails.nomCommune}`, pageWidth / 2, yPos, {
            align: "center",
          })
          yPos += 8 // Réduit de 15 à 8

          // Nettoyer les ressources
          exportData.cleanup()
        }
      } catch (error) {
        console.error("Erreur lors de la capture de la carte:", error)
        // En cas d'erreur, on continue sans la carte
        doc.setFontSize(9)
        doc.setFont("helvetica", "italic")
        doc.text("La carte n'a pas pu être incluse dans le document.", pageWidth / 2, yPos, { align: "center" })
        yPos += 8 // Réduit de 15 à 8
      }
    }

    // Pour chaque Fokotany
    communeDetails.fokotanys.forEach((fokotany, index) => {
      // Vérifier s'il faut ajouter une nouvelle page
      if (yPos > pageHeight - 50) { // Seuil augmenté pour maximiser l'utilisation de la page
        doc.addPage()
        yPos = 15 // Réduit de 20 à 15
      }

      // Titre du Fokotany
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text(`Fokotany: ${fokotany.nomFokotany}`, 14, yPos)
      const textWidth = doc.getTextWidth(`Fokotany: ${fokotany.nomFokotany}`);

// Tracer une ligne en dessous pour simuler un soulignement
doc.line(14, yPos + 1, 14 + textWidth, yPos + 1); 
      yPos += 8 // Réduit de 10 à 8

      // Table des Responsables
      if (fokotany.responsables && fokotany.responsables.length > 0) {
        doc.setFontSize(11) // Taille réduite
        doc.text("Responsables du Fokotany", 14, yPos)
        yPos += 4 // Réduit de 6 à 4

        // Configuration de la table des responsables
        const responsablesData = fokotany.responsables.map((resp) => [
          resp.classe_responsable || "",
          resp.nom_responsable || "",
          resp.prenom_responsable || "",
          resp.fonction || "",
          resp.contact_responsable || "",
        ])

        autoTable(doc, {
          startY: yPos,
          head: [["Rôle", "Nom", "Prénom", "Fonction", "Contact"]],
          body: responsablesData,
          margin: { left: 14, right: 14 },
          headStyles: { fillColor: [41, 128, 185], textColor: 255 },
          styles: { fontSize: 9, cellPadding: 1 }, // Padding réduit
          rowPageBreak: 'avoid', // Évite les coupures de lignes entre les pages
        })

        yPos = doc.lastAutoTable.finalY + 6 // Réduit de 10 à 6
      }

      // Table des Services
      if (fokotany.services && fokotany.services.length > 0) {
        // Vérifier s'il reste assez d'espace pour le titre et au moins une ligne
        if (yPos > pageHeight - 35) { // Seuil augmenté
          doc.addPage()
          yPos = 15 // Réduit de 20 à 15
        }

        doc.setFontSize(11) // Taille réduite
        doc.text("Services disponibles", 14, yPos)
        yPos += 4 // Réduit de 6 à 4

        // Configuration de la table des services
        const servicesData = fokotany.services.map((service) => [
          service.nomService || "",
          service.description || "",
          service.offre || "",
          service.membre || "",
          service.nombre_membre?.toString() || "0",
        ])

        autoTable(doc, {
          startY: yPos,
          head: [["Service", "Description", "Offre", "Membres", "Nombre"]],
          body: servicesData,
          margin: { left: 14, right: 14 },
          headStyles: { fillColor: [46, 204, 113], textColor: 255 },
          styles: { fontSize: 9, cellPadding: 1 }, // Padding réduit
          columnStyles: {
            0: { cellWidth: 28 }, // Légèrement réduit
            1: { cellWidth: "auto" },
            2: { cellWidth: "auto" },
            3: { cellWidth: 28 }, // Légèrement réduit
            4: { cellWidth: 18 }, // Légèrement réduit
          },
          rowPageBreak: 'avoid', // Évite les coupures de lignes entre les pages
        })

        yPos = doc.lastAutoTable.finalY + 8 // Réduit de 15 à 8
      }

      // Ajouter une nouvelle page si ce n'est pas le dernier Fokotany et si nous avons déjà utilisé plus de la moitié de la page
      if (index < communeDetails.fokotanys.length - 1 && yPos > pageHeight / 2) {
        doc.addPage()
        yPos = 15 // Réduit de 20 à 15
      }
    })

    // Pied de page
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.text(`Page ${i} sur ${pageCount}`, pageWidth / 2, pageHeight - 8, { align: "center" }) // Position ajustée
    }

    // Enregistrement du PDF
    doc.save(`Commune_${communeDetails.nomCommune}_Details.pdf`)
  },

  /**
   * Exporte uniquement les données d'un fokotany spécifique
   * @param {Object} fokotany - Données du fokotany à exporter
   * @param {String} communeNom - Nom de la commune parente
   * @param {Number} communeId - ID de la commune parente
   */
  exportFokotany: async (fokotany, communeNom, communeId) => {
    if (!fokotany) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // En-tête
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text(`Fokotany: ${fokotany.nomFokotany}`, pageWidth / 2, 15, { align: "center" })

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Commune: ${communeNom}`, pageWidth / 2, 22, { align: "center" })

    const today = new Date().toLocaleDateString("fr-FR")
    doc.setFontSize(9) // Taille réduite
    doc.text(`Date d'exportation: ${today}`, pageWidth - 15, 10, { align: "right" })

    let yPos = 28 // Réduit de 30 à 28

    // Capture et ajout de la carte si la fonction de préparation est disponible
    if (window.prepareMapForExport && communeId) {
      try {
        // Préparer une carte spécifique pour l'export
        const exportData = window.prepareMapForExport(communeId)

        if (exportData) {
          // Attendre que la carte soit complètement chargée
          await new Promise((resolve) => setTimeout(resolve, 800))

          // Capture de la carte avec html2canvas
          const canvas = await html2canvas(exportData.container, {
            useCORS: true,
            scale: 2, // Meilleure qualité
            logging: false,
            allowTaint: true,
            backgroundColor: "#ffffff", // Assurer un fond blanc
          })

          // Conversion du canvas en image
          const mapImgData = canvas.toDataURL("image/png")

          // Calcul des dimensions pour maintenir le ratio et centrer l'image
          const maxWidth = pageWidth - 20 // Marges réduites (de 30 à 20)
          const maxHeight = 120 // Hauteur réduite (de 140 à 120)

          // Calcul des dimensions en préservant le ratio
          let mapWidth, mapHeight
          const imageRatio = canvas.width / canvas.height

          if (canvas.width / canvas.height > maxWidth / maxHeight) {
            // Si l'image est plus large que haute
            mapWidth = maxWidth
            mapHeight = mapWidth / imageRatio
          } else {
            // Si l'image est plus haute que large
            mapHeight = maxHeight
            mapWidth = mapHeight * imageRatio
          }

          // Calcul de la position X pour centrer l'image
          const xPos = (pageWidth - mapWidth) / 2

          // Ajout de l'image au PDF avec une bordure
          doc.setDrawColor(0)
          doc.setLineWidth(0.5)
          doc.rect(xPos - 1, yPos - 1, mapWidth + 2, mapHeight + 2)
          doc.addImage(mapImgData, "PNG", xPos, yPos, mapWidth, mapHeight)

          // Mise à jour de la position Y pour le contenu suivant
          yPos += mapHeight + 5 // Réduit de 10 à 5

          // Ajouter une légende pour la carte
          doc.setFontSize(9) // Taille réduite
          doc.setFont("helvetica", "italic")
          doc.text(`Périmètre de la commune de ${communeNom}`, pageWidth / 2, yPos, {
            align: "center",
          })
          yPos += 8 // Réduit de 15 à 8

          // Nettoyer les ressources
          exportData.cleanup()
        }
      } catch (error) {
        console.error("Erreur lors de la capture de la carte:", error)
        // En cas d'erreur, on continue sans la carte
        doc.setFontSize(9)
        doc.setFont("helvetica", "italic")
        doc.text("La carte n'a pas pu être incluse dans le document.", pageWidth / 2, yPos, { align: "center" })
        yPos += 8 // Réduit de 15 à 8
      }
    }

    // Responsables
    if (fokotany.responsables && fokotany.responsables.length > 0) {
      // Vérifier s'il faut ajouter une nouvelle page
      if (yPos > pageHeight - 50) { // Seuil augmenté
        doc.addPage()
        yPos = 15 // Réduit de 20 à 15
      }

      doc.setFontSize(11) // Taille réduite
      doc.setFont("helvetica", "bold")
      doc.text("Responsables du Fokotany", 14, yPos)
      yPos += 4 // Réduit de 6 à 4

      const responsablesData = fokotany.responsables.map((resp) => [
        resp.classe_responsable || "",
        resp.nom_responsable || "",
        resp.prenom_responsable || "",
        resp.fonction || "",
        resp.contact_responsable || "",
      ])

      autoTable(doc, {
        startY: yPos,
        head: [["Rôle", "Nom", "Prénom", "Fonction", "Contact"]],
        body: responsablesData,
        margin: { left: 14, right: 14 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 9, cellPadding: 1 }, // Padding réduit
        rowPageBreak: 'avoid', // Évite les coupures de lignes entre les pages
      })

      yPos = doc.lastAutoTable.finalY + 6 // Réduit de 10 à 6
    }

    // Services
    if (fokotany.services && fokotany.services.length > 0) {
      if (yPos > pageHeight - 35) { // Seuil augmenté
        doc.addPage()
        yPos = 15 // Réduit de 20 à 15
      }

      doc.setFontSize(11) // Taille réduite
      doc.setFont("helvetica", "bold")
      doc.text("Services disponibles", 14, yPos)
      yPos += 4 // Réduit de 6 à 4

      const servicesData = fokotany.services.map((service) => [
        service.nomService || "",
        service.description || "",
        service.offre || "",
        service.membre || "",
        service.nombre_membre?.toString() || "0",
      ])

      autoTable(doc, {
        startY: yPos,
        head: [["Service", "Description", "Offre", "Membres", "Nombre"]],
        body: servicesData,
        margin: { left: 14, right: 14 },
        headStyles: { fillColor: [46, 204, 113], textColor: 255 },
        styles: { fontSize: 9, cellPadding: 1 }, // Padding réduit
        columnStyles: {
          0: { cellWidth: 28 }, // Légèrement réduit
          1: { cellWidth: "auto" },
          2: { cellWidth: "auto" },
          3: { cellWidth: 28 }, // Légèrement réduit
          4: { cellWidth: 18 }, // Légèrement réduit
        },
        rowPageBreak: 'avoid', // Évite les coupures de lignes entre les pages
      })
    }

    // Pied de page
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.text(`Page ${i} sur ${pageCount}`, pageWidth / 2, pageHeight - 8, { align: "center" }) // Position ajustée
    }

    // Enregistrement du PDF
    doc.save(`Fokotany_${fokotany.nomFokotany}.pdf`)
  },
}

export default CommunePDFExporter