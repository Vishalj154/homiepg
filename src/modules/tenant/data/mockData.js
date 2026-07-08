export const featuredPgs = [
  {
    id: 1,
    name: 'Skyline Nest PG',
    city: 'Bengaluru',
    area: 'Koramangala',
    rent: '₹14,500',
    rating: '4.8',
    beds: 3,
    amenities: ['WiFi', 'AC', 'Laundry', 'Gym'],
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    name: 'Harbor Stay',
    city: 'Bengaluru',
    area: 'Indiranagar',
    rent: '₹12,800',
    rating: '4.6',
    beds: 2,
    amenities: ['Food', 'Parking', 'Security'],
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
  },
]

export const nearbyPgs = [
  {
    id: 3,
    name: 'Aqua Residence',
    city: 'Bengaluru',
    area: 'HSR Layout',
    rent: '₹10,900',
    rating: '4.5',
    beds: 5,
    amenities: ['WiFi', 'Food', 'Laundry'],
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
  },
]

export const notifications = [
  { id: 1, title: 'Booking confirmed', detail: 'Your bed at Skyline Nest is reserved for 12 Aug.', time: '2h ago', tone: 'positive' },
  { id: 2, title: 'Rent due soon', detail: 'Payment reminder for August rent.', time: '5h ago', tone: 'warning' },
  { id: 3, title: 'Owner message', detail: 'New house rules shared by the property owner.', time: 'Yesterday', tone: 'info' },
]

export const payments = [
  { id: 'INV-1001', month: 'July', amount: '₹12,500', status: 'Paid' },
  { id: 'INV-1002', month: 'June', amount: '₹12,500', status: 'Paid' },
]

export const bookings = [
  { id: 'B-204', property: 'Skyline Nest', room: 'A-12', bed: 'B3', status: 'Confirmed' },
  { id: 'B-205', property: 'Harbor Stay', room: 'C-02', bed: 'B1', status: 'Pending' },
]
