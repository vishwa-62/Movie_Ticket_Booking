import jsPDF from 'jspdf';

export const generatePDFTicket = (booking) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [100, 180] // Ticket dimensions
  });

  // Background Ticket Styling
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 100, 180, 'F');

  // Header banner
  doc.setFillColor(225, 29, 72); // rose-600
  doc.rect(0, 0, 100, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('CINEPASS', 50, 12, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL DIGITAL ADMIT TICKET', 50, 18, { align: 'center' });

  // Booking Code Pill
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(25, 22, 50, 8, 2, 2, 'F');
  doc.setTextColor(225, 29, 72);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(booking.booking_code || 'MB-100200', 50, 27.5, { align: 'center' });

  // Movie Details
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  const title = booking.movie_title || 'Movie Title';
  const splitTitle = doc.splitTextToSize(title, 90);
  doc.text(splitTitle, 50, 42, { align: 'center' });

  let currentY = 42 + (splitTitle.length * 6);

  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${booking.language || 'English'} | ${booking.genre || 'Action'}`, 50, currentY, { align: 'center' });

  currentY += 8;

  // Divider line
  doc.setDrawColor(51, 65, 85);
  doc.setLineWidth(0.4);
  doc.line(10, currentY, 90, currentY);

  currentY += 8;

  // Information Grid
  const addInfoRow = (label, value) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(label, 12, currentY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(String(value), 88, currentY, { align: 'right' });

    currentY += 7;
  };

  addInfoRow('THEATRE:', booking.theatre_name || 'PVR Cinemas');
  addInfoRow('LOCATION:', `${booking.theatre_location || 'Brookefields'}, ${booking.city || 'Coimbatore'}`);
  addInfoRow('SHOW DATE:', booking.show_date || '2026-09-26');
  addInfoRow('SHOW TIME:', booking.show_time || '07:30 PM');
  addInfoRow('SCREEN:', booking.screen_name || 'Screen 1');

  const seatNumbers = booking.seats && booking.seats.length > 0 
    ? booking.seats.map(s => s.seat_number).join(', ')
    : 'A1, A2';

  addInfoRow('SEATS:', seatNumbers);
  addInfoRow('AMOUNT PAID:', `INR ${Number(booking.total_amount || 390).toFixed(2)}`);
  addInfoRow('STATUS:', booking.booking_status || 'CONFIRMED');

  currentY += 4;
  doc.line(10, currentY, 90, currentY);
  currentY += 8;

  // QR Code placeholder text / barcode styling
  doc.setFillColor(255, 255, 255);
  doc.rect(35, currentY, 30, 30, 'F');

  // Simulated QR grid lines inside box
  doc.setFillColor(15, 23, 42);
  doc.rect(38, currentY + 3, 8, 8, 'F');
  doc.rect(54, currentY + 3, 8, 8, 'F');
  doc.rect(38, currentY + 19, 8, 8, 'F');

  currentY += 36;
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.text('Scan at Cinema Entry Gate', 50, currentY, { align: 'center' });
  doc.text('Valid for single admission only.', 50, currentY + 4, { align: 'center' });

  // Save the PDF
  doc.save(`Ticket_${booking.booking_code || 'CinePass'}.pdf`);
};
