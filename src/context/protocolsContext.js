import React, { useState, useEffect, useContext, useReducer } from 'react';
import reducer from '../reducers/protocols_reducers';
import axios from 'axios';
import { GET_ALL_PROTOCOLS, UPDATE_FILTER, UPDATE_PROTOCOL } from '../actions';
import { baseURL } from '../utils/baseURL';

const initialState = {
  protocols: [],
  protocols_filtered: [],
  filter: '',
  protocol_to_update: {},
  page: '',
};

const ProtocolContext = React.createContext();

const ProtocolProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [updateProtocolList, setUpdateProtocolList] = useState(false);

  const setFilter = (key) => {
    dispatch({ type: UPDATE_FILTER, payload: key });
  };

  const updateProtocol = (id) => {
    dispatch({ type: UPDATE_PROTOCOL, payload: id });
  };

  const getProtocols = async () => {
    try {
      const { data } = await axios.get(
        `${baseURL}/api/v1/protocols?page=${state.page}&max=${state.max}`
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const { protocols } = await getProtocols();
      if (protocols.length !== 0) {
        dispatch({ type: GET_ALL_PROTOCOLS, payload: protocols });
      }
    }
    fetchData();
  }, [updateProtocolList, state.page]);

  return (
    <ProtocolContext.Provider
      value={{
        ...state,
        updateProtocolList,
        setFilter,
        updateProtocol,
        setUpdateProtocolList,
      }}
    >
      {children}
    </ProtocolContext.Provider>
  );
};

export const useProtocolContext = () => {
  return useContext(ProtocolContext);
};

export { ProtocolProvider };
