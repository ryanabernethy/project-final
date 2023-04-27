import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div style={{backgroundColor: '#E0E0E0', height: '4rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '23vh'}}>
      <h6 style={{letterSpacing: '1px', textAlign: 'center'}}>&copy; {currentYear} MedicalBooking101. All rights reserved.</h6>
    </div>
  )
}

export default Footer