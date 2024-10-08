import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
// import Carousel from '../components/Carousel'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { Flex, Spinner } from '@chakra-ui/react'
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [foodCat, setFoodCat] = useState(null)
  const [foodItems, setFoodItems] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadFoodItems()
  }, [])

  const loadFoodItems = async () => {

    try {
      setLoading(true);
      let response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/foodData`, {
        // credentials: 'include',
        // Origin:"http://localhost:3000/login",
        // referrerPolicy: "unsafe_url",
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }

      });
      const respData = await response.json()
      setFoodItems(respData.foodCollection)
      setFoodCat(respData.foodCategory)
      setLoading(false);
    } catch (error) {
      // setLoading(false);
      console.error(error);
    }


  }

 
  return (
    <div >
      <div>
        <Navbar />
      </div>
      <div>
        <div id="carouselExampleFade" className="carousel slide carousel-fade " data-bs-ride="carousel">

          <div className="carousel-inner " id='carousel'>
            <div className=" carousel-caption  " style={{ zIndex: "9" }}>
              <div className=" d-flex justify-content-center">  {/* justify-content-center, copy this <form> from navbar for search box */}
                <input className="form-control me-2 w-75 bg-white text-dark" type="search" placeholder="Search in here..." aria-label="Search" value={search} onChange={(e) => { setSearch(e.target.value) }} />
                {/* <button className="btn text-white bg-danger" onClick={() => { setSearch('') }}>X</button> */}
              </div>
            </div>
            <div className="carousel-item active" >
              <img src="https://img.freepik.com/premium-photo/close-up-home-made-tasty-burger-with-french-fries-fire-flames_392865-54.jpg?w=996" className="d-block w-100  " style={{ filter: "brightness(30%)" }} alt="..." />
            </div>
            <div className="carousel-item">
              <img src="https://img.freepik.com/free-photo/pizza-pizza-filled-with-tomatoes-salami-olives_140725-1200.jpg?size=626&ext=jpg" className="d-block w-100 " style={{ filter: "brightness(30%)" }} alt="..." />
            </div>
            <div className="carousel-item">
              <img src="https://img.freepik.com/premium-photo/fast-shutter-speed-food-photography-create-dyna_670382-86768.jpg?w=996" className="d-block w-100 " style={{ filter: "brightness(30%)" }} alt="..." />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div className='container '>
        {
          loading ? <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
            : foodCat.map((data) => {
              return (

                <div className='row mb-3'>
                  <div key={data._id} className='fs-3 m-3 text-white'>
                    {data.CategoryName}
                  </div>
                  <hr id="hr-success" style={{ height: "4px", backgroundImage: "-webkit-linear-gradient(left,rgb(0, 255, 137),rgb(0, 0, 0))" }} />
                  {foodItems != [] ? foodItems.filter(
                    (items) => (items.CategoryName === data.CategoryName) && (items.name.toLowerCase().includes(search.toLowerCase())))
                    .map(filterItems => {
                      return (
                        <div className='col-12 col-md-6 col-lg-3' key={filterItems._id}>

                          <Card key={filterItems._id} foodName={filterItems.name} item={filterItems} options={filterItems.options[0]} ImgSrc={filterItems.img} ></Card>
                        </div>
                      )
                    }) : <div> No Such Data </div>}
                </div>
              )
            })
        }
      </div>
      <Footer />
    </div>









  )
}
