import { Typography } from '@mui/material'
import React from 'react'
import { H1, H2, H3, Subtitle1, Paragraphe } from "../../components/ui/TypographyVariants"

function typography() {
  return (
    <>
    <h5 className="card-header">Typography</h5>
    <hr className="m-0"></hr> 
    <div className="card-body"> 
        <H1 className="mt-0">Titre 1</H1>
        <H2>Titre 2</H2>
        <H3>Titre 3</H3>
        <Subtitle1>Sous titre</Subtitle1>
        <Paragraphe>Paragraphe</Paragraphe>
    </div>
    </>
  )
}

export default typography