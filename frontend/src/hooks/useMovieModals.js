import { useReducer, useCallback } from 'react';

const initialState = {
  detailsOpen: false,
  editOpen: false,
  commentOpen: false,
  selectedMovie: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'OPEN_DETAILS':
      return { ...state, detailsOpen: true, selectedMovie: action.payload };
    case 'OPEN_EDIT':
      return { ...state, editOpen: true, selectedMovie: action.payload };
    case 'OPEN_COMMENT':
      return { ...state, commentOpen: true, selectedMovie: action.payload };
    case 'CLOSE_DETAILS':
      return { ...state, detailsOpen: false, selectedMovie: null };
    case 'CLOSE_EDIT':
      return { ...state, editOpen: false, selectedMovie: null };
    case 'CLOSE_COMMENT':
      return { ...state, commentOpen: false};
    case 'CLOSE_ALL':
      return { ...initialState };
    case 'SET_MOVIE':
      return { ...state, selectedMovie: action.payload };
    default:
      return state;
  }
}

export default function useMovieModals() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const openDetails = useCallback((movie) => {
    dispatch({ type: 'OPEN_DETAILS', payload: movie });
  }, []);

  const openEdit = useCallback((movie) => {
    dispatch({ type: 'OPEN_EDIT', payload: movie });
  }, []);

  const openComment = useCallback((movie) => {
    dispatch({ type: 'OPEN_COMMENT', payload: movie });
  }, []);

  const closeDetails = useCallback(() => {
    dispatch({ type: 'CLOSE_DETAILS' });
  }, []);

  const closeEdit = useCallback(() => {
    dispatch({ type: 'CLOSE_EDIT' });
  }, []);

  const closeComment = useCallback(() => {
    dispatch({ type: 'CLOSE_COMMENT' });
  }, []);

  const closeModals = useCallback(() => {
    dispatch({ type: 'CLOSE_ALL' });
  }, []);

  const setMovie = useCallback((movie) => {
    dispatch({ type: 'SET_MOVIE', payload: movie });
  }, []);

  return {
    modals: {
      isDetailsOpen: state.detailsOpen,
      isEditOpen: state.editOpen,
      isCommentOpen: state.commentOpen,
    },
    selectedMovie: state.selectedMovie,
    openDetails,
    openEdit,
    openComment,
    closeDetails,
    closeEdit,
    closeComment,
    closeModals,
    setMovie,
  };
}
