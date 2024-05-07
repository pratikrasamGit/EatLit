import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
// key - rzp_test_zBir78yzyC1SNp
//secret - pM34wEakDuozJm3Nx2UEZ2tY

export default function Checkout() {
  return (
    <div>
      <ChakraProvider>
        <TheRestOfYourApplication />
      </ChakraProvider>
    </div>
  )
}
