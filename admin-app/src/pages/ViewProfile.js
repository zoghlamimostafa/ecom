import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    mobile: '',
  });

  // Fonction pour récupérer les informations de l'utilisateur depuis le backend
  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/user/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []); // Appel une seule fois lorsque le composant est monté

  // Fonction pour mettre à jour les informations de l'utilisateur
  const updateUserProfile = async () => {
    try {
      const response = await axios.put('http://localhost:4000/api/user/edit-user', user);
      console.log('User updated successfully:', response.data);
      // Vous pouvez ajouter ici une logique pour afficher un message de succès ou rediriger l'utilisateur
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  // Gestionnaire pour mettre à jour les champs d'entrée
  const handleInputChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h1>Profile Page</h1>
      <form onSubmit={updateUserProfile}>
        <label>
          First Name:
          <input type="text" name="firstname" value={user.firstname} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Last Name:
          <input type="text" name="lastname" value={user.lastname} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={user.email} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Mobile:
          <input type="text" name="mobile" value={user.mobile} onChange={handleInputChange} />
        </label>
        <br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default ProfilePage;
