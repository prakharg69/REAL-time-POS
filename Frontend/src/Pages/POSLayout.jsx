// POSLayout.jsx
import { Outlet, NavLink } from "react-router-dom";

export default function POSLayout() {
  return (
    <div>
      <div className="flex gap-4 mb-4">
        <NavLink to="/pos/scanner">Scanner</NavLink>
        <NavLink to="/pos/checkout">Checkout</NavLink>
      </div>

      <Outlet />
    </div>
  );
}
