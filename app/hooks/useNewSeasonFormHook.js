import React, { useState } from 'react';

const MISSING_INPUT_ERROR = 'must be filled in';

export default function useNewSeasonFormHook() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [players, setPlayers] = useState([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const validate = () => {
    // validate inputs here
    // description is optional
    const errors = {};
    if (name === '') {
      errors['name'] = 'name ' + MISSING_INPUT_ERROR;
    }
    if (start == null || start === '') {
      errors['start'] = 'start date ' + MISSING_INPUT_ERROR;
    }
    if (end == null || end === '') {
      errors['end'] = 'end date ' + MISSING_INPUT_ERROR;
    }

    return errors;
  }

  return {
    inputs: {
      name,
      description,
      end,
      players,
      start
    },
    setters: {
      setDescription,
      setEnd,
      setName,
      setPlayers,
      setStart,
    },
    validate
  }
}
