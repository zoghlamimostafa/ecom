import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Table, Spinner, Alert, Button } from 'react-bootstrap';
import { getOrders } from '../features/user/userSlice'; // Utiliser userSlice au lieu d'ordersSlice
import { useNavigate } from 'react-router-dom';

const PageMesCommandes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Récupérer depuis state.auth pour user et state.user pour orders
  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.user);
  
  // Alias pour compatibilité avec le code existant
  const isLoading = loading;
  const isError = !!error;
  const message = error;

  useEffect(() => {
    // Vérifier que l'utilisateur est connecté
    if (!user || !user.token) {
      console.log('❌ Utilisateur non connecté, redirection vers login');
      navigate('/login');
      return;
    }

    console.log('✅ Récupération des commandes pour l\'utilisateur:', user.id);
    dispatch(getOrders());
  }, [dispatch, user, navigate]);

  // Gestion de l'erreur d'authentification
  if (!user || !user.token) {
    return (
      <Container className="my-orders-container">
        <Alert variant="warning" className="text-center">
          <h4>Authentification requise</h4>
          <p>Vous devez être connecté pour voir vos commandes.</p>
          <Button onClick={() => navigate('/login')} variant="primary">
            Se connecter
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-orders-container">
      <h2 className="my-4">Mes Commandes</h2>

      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center loader">
          <Spinner animation="border" variant="primary" />
          <span className="ms-3">Chargement...</span>
        </div>
      ) : isError ? (
        <Alert variant="danger" className="error-message">
          <strong>Erreur :</strong> {message || 'Une erreur est survenue lors du chargement des commandes'}
          <br />
          <small>
            {message && message.includes('401') ? 
              'Problème d\'authentification. Veuillez vous reconnecter.' : 
              'Erreur de communication avec le serveur.'}
          </small>
          <div className="mt-3">
            <Button 
              onClick={() => dispatch(getOrders())} 
              variant="outline-primary" 
              size="sm"
              className="me-2"
            >
              Réessayer
            </Button>
            <Button 
              onClick={() => navigate('/login')} 
              variant="primary" 
              size="sm"
            >
              Se reconnecter
            </Button>
          </div>
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
            ) : Array.isArray(orders) ? (
              orders.map((commande) => (
                <tr key={commande.id}>
                  <td data-label="#"> {commande.id} </td>
                  <td data-label="Date"> {new Date(commande.createdAt).toLocaleDateString()} </td>
                  <td data-label="Total"> {commande.totalPrice} TND </td>
                  <td data-label="Statut"> {commande.orderStatus} </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  Format de données inattendu. Veuillez rafraîchir la page.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
      
      {/* Informations de debug en mode développement */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-light border rounded">
          <h6>Debug Info:</h6>
          <small>
            <strong>User connecté:</strong> {user ? 'Oui' : 'Non'}<br />
            <strong>Token présent:</strong> {user?.token ? 'Oui' : 'Non'}<br />
            <strong>Nombre de commandes:</strong> {Array.isArray(orders) ? orders.length : 'N/A'}<br />
            <strong>État de chargement:</strong> {isLoading ? 'En cours' : 'Terminé'}<br />
            <strong>Erreur:</strong> {isError ? 'Oui' : 'Non'}<br />
            {message && <><strong>Message:</strong> {message}</>}
          </small>
        </div>
      )}
    </Container>
  );
};

export default PageMesCommandes;
