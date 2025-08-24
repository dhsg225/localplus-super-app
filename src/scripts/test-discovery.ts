// Test script for discovery service
import { discoveryService } from '../services/discoveryService';

async function testDiscovery() {
  console.log('🧪 Testing Discovery Service...');
  
  try {
    console.log('🚀 Running Bangkok Restaurant Discovery...');
    const result = await discoveryService.runHuaHinRestaurantDiscovery();
    
    console.log('📊 Discovery Results:');
    console.log('  - Discovered:', result.discovered);
    console.log('  - Added:', result.added);
    console.log('  - Duplicates:', result.duplicates);
    console.log('  - Errors:', result.errors);
    
    if (result.errors.length > 0) {
      console.log('❌ Errors occurred:');
      result.errors.forEach((error: string) => console.log('  -', error));
    }
    
    if (result.added > 0) {
      console.log('✅ Successfully added', result.added, 'new businesses!');
    } else {
      console.log('ℹ️ No new businesses added (might be duplicates)');
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

testDiscovery(); 