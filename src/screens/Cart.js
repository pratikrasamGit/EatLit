import React from 'react'
import Delete from '@mui/icons-material/Delete'
import { useCart, useDispatchCart } from '../components/ContextReducer';
import axios from "axios"

export default function Cart() {
  let data = useCart();
  let dispatch = useDispatchCart();
  if (data.length === 0) {
    return (
      <div>
        <div className='m-5 w-100 text-center fs-3 text-white'>The Cart is Empty!</div>
      </div>
    )
  }
  // const handleRemove = (index)=>{
  //   console.log(index)
  //   dispatch({type:"REMOVE",index:index})
  // }

  // const handleCheckOut = async () => {
  //   let userEmail = localStorage.getItem("userEmail");
  //   // console.log(data,localStorage.getItem("userEmail"),new Date())
  //   let response = await fetch("http://localhost:5000/api/auth/orderData", {
  //     // credentials: 'include',
  //     // Origin:"http://localhost:3000/login",
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       order_data: data,
  //       email: userEmail,
  //       // order_date: new Date().toDateString()
  //     })
  //   });

  //   if (response.status === 200) {
  //     dispatch({ type: "DROP" })
  //   }
  // }

  let profileData = [];
  const getProfileData = async () => {
    await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/profileData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: localStorage.getItem('userEmail')
      })
    }).then(async (res) => {
      profileData = await res.json()
    })

  }
  getProfileData();

  let totalPrice = data.reduce((total, food) => total + food.price, 0)

  const checkouthandler = async () => {
    
    console.log(profileData);
    let userEmail = localStorage.getItem("userEmail");

    const amount = totalPrice;

    let key = "";
    // const {data:{key}} = await response.json();

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/getkey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async (res) => {
      let data = await res.json();
      key = data.key;
    })

    let order = [];

    const orderdata = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount,
        order_data: data,
        email: userEmail
      })
    }).then(async (res) => {
      order = await res.json()
      // console.log(order)
    })


    // console.log(order);
    const options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: profileData[0].name,
      description: "Razorpay payment",
      image: "https://avatar.iran.liara.run/public/boy?username=Ash",
      order_id: order.id,//order_O352p72bY0MJuq
      callback_url: `${process.env.REACT_APP_BASE_URL}/api/auth/paymentverification`,
      prefill: {
        name: profileData[0].name,
        email: localStorage.getItem("userEmail"),
        contact: "1234567890"
      },
      notes: {
        "address": profileData[0].location
      },
      theme: {
        "color": "#3399cc"
      }
    };
    const razor = new window.Razorpay(options);
    razor.open();

  }

  return (
    <div>

      {console.log(data)}
      <div className='container m-auto mt-5 table-responsive  table-responsive-sm table-responsive-md' >
        <table className='table '>
          <thead className=' text-success fs-4'>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Option</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr className='text-white'>
                <th>{index + 1}</th>
                <td>{food.name}</td>
                <td>{food.qty}</td>
                <td>{food.size}</td>
                <td>{food.price}</td>
                <td ><button type="button" className="btn p-0 bg-danger"><Delete onClick={() => { dispatch({ type: "REMOVE", index: index }) }} /></button> </td></tr>
            ))}
          </tbody>
        </table>
        <div><h1 className='fs-2 text-white'>Total Price: {totalPrice}/-</h1></div>
        <div>
          <button className='btn bg-success mt-5 text-white' onClick={checkouthandler} > Check Out </button>
        </div>
      </div>



    </div>
  )
}
