import React from 'react'
import { Link } from 'react-router-dom'

const PaymentSuccess = () => {
  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",color:"white"}}>Payment Successfull
    <Link to="/myorder" className="m-3 mx-1 btn btn-success">Go to orders</Link>
    </div>
  )
}

export default PaymentSuccess