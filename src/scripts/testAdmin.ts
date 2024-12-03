import { Database } from '../types/supabase';

interface TestResult {
  success: boolean;
  message: string;
  data?: any;
  error?: any;
}

async function testAdmin(): Promise<void> {
  try {
    const result: TestResult = await fetch('/api/admin/test').then(res => res.json());
    
    if (result.success) {
      console.log('Test successful:', result.message);
      console.log('Data:', result.data);
    } else {
      console.error('Test failed:', result.message);
    }
  } catch (error: unknown) {
    console.error('Error running test:', error instanceof Error ? error.message : 'Unknown error');
  }
}

testAdmin();
