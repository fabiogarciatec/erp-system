async function testAdmin() {
    try {
        const result = await fetch('/api/admin/test').then(res => res.json());
        if (result.success) {
            console.log('Test successful:', result.message);
            console.log('Data:', result.data);
        }
        else {
            console.error('Test failed:', result.message);
        }
    }
    catch (error) {
        console.error('Error running test:', error instanceof Error ? error.message : 'Unknown error');
    }
}
testAdmin();
export {};
