import React from 'react'
import Navbar from '../../layouts/Navbar'
import LayoutExample from "../../components/layouts-example/LayoutWrapper";

function MapViews() {
  return (
    <div className="layout-demo-wrapper">
        <Navbar /> 
        <LayoutExample
        img="/assets/img/layouts/layout-without-menu-light.png"
        alt="Layout without menu"
        title="Layout without Menu (Navigation)"
        ></LayoutExample>
    </div>
  )
}

export default MapViews