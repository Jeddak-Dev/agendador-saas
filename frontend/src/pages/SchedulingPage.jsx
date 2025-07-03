import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import './SchedulingPage.css';

// Componente para o calendário
const Calendar = ({ onDateSelect, selectedDate }) => {
  const [date, setDate] = useState(new Date());

  const handleDateClick = (day) => {
    const newDate = new Date(date.getFullYear(), date.getMonth(), day);
    onDateSelect(newDate);
  };

  const daysInMonth = () => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const renderDays = () => {
    const days = [];
    for (let i = 1; i <= daysInMonth(); i++) {
      const isSelected = selectedDate &&
                         i === selectedDate.getDate() &&
                         date.getMonth() === selectedDate.getMonth() &&
                         date.getFullYear() === selectedDate.getFullYear();
      days.push(
        <div
          key={i}
          className={`calendar-day ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateClick(i)}
        >
          {i}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => setDate(new Date(date.setMonth(date.getMonth() - 1)))}>‹</button>
        <h2>{date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}</h2>
        <button onClick={() => setDate(new Date(date.setMonth(date.getMonth() + 1)))}>›</button>
      </div>
      <div className="calendar-grid">
        {renderDays()}
      </div>
    </div>
  );
};

// Componente principal da página de agendamento
const SchedulingPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  const availableTimes = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reseta a hora ao mudar o dia
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !clientName || !clientEmail) {
      toast.error('Por favor, preencha todos os campos e selecione uma data e horário.');
      return;
    }

    // Lógica de agendamento aqui (ex: chamada de API com axios)
    console.log({
      date: selectedDate.toLocaleDateString(),
      time: selectedTime,
      name: clientName,
      email: clientEmail,
    });

    toast.success(`Agendamento confirmado para ${clientName} em ${selectedDate.toLocaleDateString()} às ${selectedTime}!`);

    // Limpar o formulário
    setSelectedDate(null);
    setSelectedTime(null);
    setClientName('');
    setClientEmail('');
  };

  return (
    <div className="scheduling-container">
      <div className="scheduling-card">
        <div className="service-info">
          <h1>Agende seu Horário</h1>
          <h2>Corte de Cabelo Premium</h2>
          <p className="service-description">
            Uma experiência completa de corte de cabelo, incluindo lavagem, corte estilizado e finalização com os melhores produtos.
          </p>
          <div className="service-details">
            <span><strong>Duração:</strong> 60 minutos</span>
            <span><strong>Preço:</strong> R$ 80,00</span>
          </div>
        </div>

        <div className="scheduler">
          <div className="date-time-picker">
            <h3>1. Selecione a Data</h3>
            <Calendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
          </div>

          {selectedDate && (
            <div className="time-slots">
              <h3>2. Selecione o Horário</h3>
              <div className="slots-grid">
                {availableTimes.map(time => (
                  <button
                    key={time}
                    className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {selectedDate && selectedTime && (
            <div className="booking-form-section">
                <h3>3. Preencha seus dados</h3>
                <form className="booking-form" onSubmit={handleBooking}>
                    <div className="form-group">
                        <label htmlFor="name">Nome Completo</label>
                        <input
                        type="text"
                        id="name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">E-mail</label>
                        <input
                        type="email"
                        id="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        required
                        />
                    </div>
                    <button type="submit" className="confirm-button">
                        Confirmar Agendamento
                    </button>
                </form>
            </div>
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
};

export default SchedulingPage;