import mongoose from 'mongoose';

// MongoDB Atlas connection string
const uri = "mongodb+srv://yakubovdev:Azizbek0717@cluster0.zd8gpsb.mongodb.net/infast-crm?retryWrites=true&w=majority";

console.log('🔍 Testing MongoDB Atlas connection...');

mongoose.connect(uri)
  .then(() => {
    console.log('✅ MongoDB Atlas connected successfully!');
    
    // Test database operations
    const db = mongoose.connection.db;
    db.listCollections().toArray((err, collections) => {
      if (err) {
        console.error('❌ Error listing collections:', err);
      } else {
        console.log('📊 Collections found:', collections.map(c => c.name));
      }
      
      mongoose.connection.close();
      process.exit(0);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB Atlas connection failed:');
    console.error('Error:', error.message);
    
    // Common issues and solutions
    console.log('\n🔧 Possible solutions:');
    console.log('1. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('2. Verify username and password are correct');
    console.log('3. Check network connection/firewall');
    console.log('4. Try with different connection options');
    
    // Try alternative connection
    console.log('\n🔄 Trying alternative connection...');
    const altUri = "mongodb+srv://yakubovdev:Azizbek0717@cluster0.zd8gpsb.mongodb.net/infast-crm?retryWrites=true&w=majority&connectTimeoutMS=30000&socketTimeoutMS=30000";
    
    mongoose.connect(altUri)
      .then(() => {
        console.log('✅ Alternative connection successful!');
        mongoose.connection.close();
        process.exit(0);
      })
      .catch((altError) => {
        console.error('❌ Alternative connection also failed:', altError.message);
        process.exit(1);
      });
  });
