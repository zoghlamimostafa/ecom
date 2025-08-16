import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Table, Spinner, Alert } from 'react-bootstrap';
import { fetchOrders } from '../features/user/ordersSlice'; // Assure-toi que ce chemin est correct

const PageMesCommandes = () => {
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <Container className="my-orders-container">
      <h2 className="my-4">Mes Commandes</h2>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center loader">
          <Spinner animation="border" variant="primary" />
          <span className="ms-3">Chargement...</span>
        </div>
      ) : error ? (
        <Alert variant="danger" className="error-message">
          <strong>Erreur :</strong> {error}
        </Alert>
      ) : (
        <Table striped bordered hover responsive className="orders-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Total</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(orders) && orders.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center no-orders">
                  Aucune commande trouvée.
                </td>
              </tr>
            ) : (
              orders.map((commande) => (
                <tr key={commande._id}>
                  <td data-label="#"> {commande._id} </td>
                  <td data-label="Date"> {new Date(commande.createdAt).toLocaleDateString()} </td>
                  <td data-label="Total"> {commande.totalPrice} TND </td>
                  <td data-label="Statut"> {commande.orderStatus} </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default PageMesCommandes;
