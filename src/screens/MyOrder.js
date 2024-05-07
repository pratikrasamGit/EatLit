import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Chip from '@mui/material/Chip';

export default function MyOrder() {

    const [orderData, setorderData] = useState([])

    const fetchMyOrder = async () => {
        // console.log(localStorage.getItem('userEmail'))
        await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/myOrderData`, {
            // credentials: 'include',
            // Origin:"http://localhost:3000/login",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: localStorage.getItem('userEmail')
            })
        }).then(async (res) => {
            let response = await res.json()
            await setorderData(response)
            console.log(response)
        })



        // await res.map((data)=>{
        //    console.log(data)
        // })


    }

    useEffect(() => {
        fetchMyOrder()
    }, [])

    return (
        <div>
            <div>
                <Navbar />
            </div>

            <div className='container'>
                <div className='row'>
                    {orderData === null && <div className='m-3 w-100 text-center fs-3 text-white'>No Orders found</div>}

                    {orderData.toReversed().map(order => (

                        <div>
                            <div className='m-auto mt-5 text-white'>
                                {(new Date(order.order_date)).toLocaleString('en-001')}{" "}
                                
                                {order.is_paid == true ? 
                                <Chip label="Paid" color="success" />

                                : <Chip label="Cancelled" color="error" />

                                }


                                <hr id="hr-success" style={{ height: "4px", backgroundImage: "-webkit-linear-gradient(left,rgb(0, 255, 137),rgb(0, 0, 0))" }} />
                            </div>


                            <div className="card-container">
                                <div className='row mb-3'>
                                    {order.order_data.map((arrayData, index) => (
                                        <div className='col-12 col-md-6 col-lg-3' >
                                            <div className="card mt-3" style={{ width: "16rem", maxHeight: "380px" }}>
                                                <img src={arrayData.img} className="card-img-top" alt="..." style={{ height: "120px", objectFit: "fill" }} />
                                                <div className="card-body">
                                                    <h5 className="card-title">{arrayData.name}</h5>
                                                    <div className='container w-100 p-0' style={{ height: "38px" }}>
                                                        <span className='m-1'>Qty - {arrayData.qty}</span>
                                                        <span className='m-1'>Size - {arrayData.size}</span>

                                                        <div className=' ms-2 h-100 w-20 fs-5' >
                                                           Total - ₹{arrayData.price}/-
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    ))}

                </div>


            </div>

            <Footer />
        </div>
    )
}
