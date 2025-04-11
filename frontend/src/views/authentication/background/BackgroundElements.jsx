import { Box } from '@mui/material'
import React from 'react'

function BackgroundElements() {
  return (
    <>
      {/* Élément arrière-plan 1 */}
      <Box 
        sx={{
          position: "absolute",
          top: -150,
          left: 100,
          width: 250,
          height: 400, 
          backgroundImage: 'url("/assets/background/2.svg")',
          zIndex: 0,
          backgroundSize: "contain",
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Élément arrière-plan 2 */}
      <Box 
        sx={{
          position: "absolute",
          bottom: 50,
          left: -20,
          width: 100,
          height: 100, 
          backgroundImage: 'url("/assets/background/1.svg")',
          zIndex: 0,
          backgroundSize: "contain",
          backgroundRepeat: 'no-repeat',
        }}
      /> 
      
      {/* Élément arrière-plan 3 */}
      <Box
        sx={{
          position: "absolute",
          bottom: -100,
          left: 450,
          width: 100,
          height: 250, 
          backgroundImage: 'url("/assets/background/3.svg")',
          zIndex: 0,
          backgroundSize: "contain",
          backgroundRepeat: 'no-repeat',
        }}
      /> 
      
      {/* Élément arrière-plan 4 - image principale */}
      <Box 
        sx={{
          position: "absolute",
          top: 0,
          right: 0, 
          backgroundImage: 'url("/assets/background/image.png")',
          zIndex: 0,
          width: 500,
          height: 600, 
          backgroundSize: "contain",
          backgroundRepeat: 'no-repeat',
        }}
      />
    </>
  )
}

export default BackgroundElements