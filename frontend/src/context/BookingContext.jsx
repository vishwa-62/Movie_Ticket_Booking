import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [bookingState, setBookingState] = useState({
    movie: null,
    showDate: new Date().toISOString().split('T')[0],
    theatre: null,
    show: null,
    selectedSeats: [], // Array of seat objects
    city: 'Coimbatore'
  });

  const selectMovie = (movie) => {
    setBookingState(prev => ({ ...prev, movie, theatre: null, show: null, selectedSeats: [] }));
  };

  const selectCity = (city) => {
    setBookingState(prev => ({ ...prev, city }));
  };

  const selectShowDate = (dateStr) => {
    setBookingState(prev => ({ ...prev, showDate: dateStr, show: null, selectedSeats: [] }));
  };

  const selectTheatreAndShow = (theatre, show) => {
    setBookingState(prev => ({ ...prev, theatre, show, selectedSeats: [] }));
  };

  const toggleSeat = (seat) => {
    setBookingState(prev => {
      const exists = prev.selectedSeats.some(s => s.id === seat.id);
      let updated;
      if (exists) {
        updated = prev.selectedSeats.filter(s => s.id !== seat.id);
      } else {
        if (prev.selectedSeats.length >= 10) {
          alert('You can select a maximum of 10 seats per transaction.');
          return prev;
        }
        updated = [...prev.selectedSeats, seat];
      }
      return { ...prev, selectedSeats: updated };
    });
  };

  const clearBooking = () => {
    setBookingState({
      movie: null,
      showDate: new Date().toISOString().split('T')[0],
      theatre: null,
      show: null,
      selectedSeats: [],
      city: 'Coimbatore'
    });
  };

  const getSubtotal = () => {
    if (!bookingState.selectedSeats.length) return 0;
    const basePrice = bookingState.show?.ticket_price || 180;
    return bookingState.selectedSeats.reduce((sum, seat) => sum + Number(seat.price || basePrice), 0);
  };

  const getConvenienceFee = () => {
    return bookingState.selectedSeats.length > 0 ? 30 : 0;
  };

  const getTotalAmount = () => {
    return getSubtotal() + getConvenienceFee();
  };

  return (
    <BookingContext.Provider
      value={{
        bookingState,
        selectMovie,
        selectCity,
        selectShowDate,
        selectTheatreAndShow,
        toggleSeat,
        clearBooking,
        getSubtotal,
        getConvenienceFee,
        getTotalAmount
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
