async function testConnection() {
    try {
        const result = await fetch('/api/test').then(res => res.json());
        if (result.success) {
            console.log('Connection test successful:', result.message);
            if (result.data) {
                console.log('Data:', result.data);
            }
        }
        else {
            console.error('Connection test failed:', result.message);
            if (result.error) {
                console.error('Error details:', result.error);
            }
        }
    }
    catch (error) {
        console.error('Error testing connection:', error instanceof Error ? error.message : 'Unknown error');
    }
}
testConnection();
export {};
