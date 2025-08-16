import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../features/cutomers/customerSlice";

const CustomersDebug = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    console.log('🔍 CustomersDebug: Component mounted, dispatching getUsers');
    dispatch(getUsers());
  }, [dispatch]);
  
  const customerState = useSelector((state) => {
    console.log('🔍 CustomersDebug: Full Redux state:', state);
    console.log('🔍 CustomersDebug: Customer state:', state.customer);
    return state.customer;
  });
  
  const { customers, isLoading, isError, message, isSuccess } = customerState;
  
  console.log('🔍 CustomersDebug: Extracted values:', {
    customers: customers || [],
    isLoading,
    isError,
    message,
    isSuccess,
    customersLength: customers ? customers.length : 0
  });
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', margin: '20px', borderRadius: '8px' }}>
      <h4>🔍 Customers Debug Info</h4>
      <div style={{ marginBottom: '10px' }}>
        <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>Error:</strong> {isError ? 'Yes' : 'No'}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>Success:</strong> {isSuccess ? 'Yes' : 'No'}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>Message:</strong> {message || 'None'}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>Customers Array:</strong> {customers ? `${customers.length} items` : 'null/undefined'}
      </div>
      {customers && customers.length > 0 && (
        <div>
          <strong>Customer Names:</strong>
          <ul>
            {customers.slice(0, 3).map((customer, index) => (
              <li key={index}>
                {customer.firstname} {customer.lastname} ({customer.email})
              </li>
            ))}
            {customers.length > 3 && <li>... and {customers.length - 3} more</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomersDebug;
