import type { Entry } from '../../types/entries';

const API_URL = import.meta.env.VITE_API_URL;
console.log('Backend API:', API_URL);

export async function postNewEntry(entry: Entry): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/newEntry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });
    if (!response.ok) {
      throw new Error(`HTTP error on POST! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Successfully posted entry:', data);
    // Optionally fetch updated data if needed...
  } catch (error) {
    console.error('Error posting new entry:', error);
  }
}

export async function updateEntry(entry: Entry): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/updateEntry`, {
      method: 'PUT', // or PATCH, depending on your backend implementation
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });
    if (!response.ok) {
      throw new Error(`HTTP error on update! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Successfully updated entry:', data);
  } catch (error) {
    console.error('Error updating entry:', error);
  }
}
