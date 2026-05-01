import React from 'react'
import SalesOverview from '../Components/SalesOverview'
import TopSellingProducts from '../Components/TopSellingProducts'
import SalesTrend from '../Components/SalesTrend'
import LowStockAlert from '../Components/LowStockAlert'
import InventoryStats from '../Components/InventoryStats'
import CategoryPerformance from '../Components/CategoryPerformance'

function Dashboard() {
  return (
    <div><SalesOverview></SalesOverview>
    <SalesTrend></SalesTrend>
    <TopSellingProducts></TopSellingProducts>
    <LowStockAlert></LowStockAlert>
    <InventoryStats></InventoryStats>
    <CategoryPerformance></CategoryPerformance>
    
    </div>
  )
}

export default Dashboard