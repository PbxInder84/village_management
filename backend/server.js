// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/news', require('./routes/news'));
app.use('/api/panchayat', require('./routes/panchayat')); 