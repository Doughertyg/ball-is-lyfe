import React, { useState } from 'react';

const MISSING_INPUT_ERROR = 'must be filled in';

export default function useNewLeagueFormHook() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [sport, setSport] = useState(''); // consider changing this to a db-backed object
  const [profilePicture, setProfilePicture] = useState('');
  const [bannerPicture, setBannerPicture] = useState('');
  const [players, setPlayers] = useState({});

  const validate = () => {
    // validate inputs here
    const errors = {};
    if (name === '') {
      errors['name'] = 'name ' + MISSING_INPUT_ERROR;
    }
    if (description === '') {
      errors['description'] = 'description ' + MISSING_INPUT_ERROR;
    }
    if (sport === '') {
      errors['sport'] = 'sport ' + MISSING_INPUT_ERROR;
    }

    return errors;
  }

  return {
    inputs: {
      name,
      description,
      location,
      sport,
      profilePicture,
      bannerPicture,
      players
    },
    setters: {
      setBannerPicture,
      setDescription,
      setLocation,
      setName,
      setPlayers,
      setProfilePicture,
      setSport
    },
    validate
  }
}
