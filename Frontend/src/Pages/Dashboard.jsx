import React from 'react'
import SalesOverview from '../Components/SalesOverview'
import TopSellingProducts from '../Components/TopSellingProducts'
import SalesTrend from '../Components/SalesTrend'

function Dashboard() {
  return (
    <div><SalesOverview></SalesOverview>
    <SalesTrend></SalesTrend>
    <TopSellingProducts></TopSellingProducts>
    
    </div>
  )
}

export default Dashboard