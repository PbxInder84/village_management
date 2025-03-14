// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/panchayat/members', require('./routes/panchayat'));
app.use('/api/news', require('./routes/news'));
app.use('/api/events', require('./routes/events'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/polls', require('./routes/polls'));
app.use('/api/services/types', require('./routes/serviceTypes'));
app.use('/api/services/requests', require('./routes/serviceRequests')); 