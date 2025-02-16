const API_URL = import.meta.env.VITE_API_URL;
console.log('Backend API:', API_URL);

import type { Statement } from '../../types/types';

export async function postNewStatement(statement: Statement): Promise<void> {
  try {
    // POST operation
    const postResponse = await fetch(`${API_URL}/newEntry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statement),
    });
    if (!postResponse.ok) {
      throw new Error(`HTTP error on POST! status: ${postResponse.status}`);
    }
    const postData = await postResponse.json();
    console.log('Successfully posted:', postData);

    // Optionally, if you want to fetch updated data after posting:
    const getResponse = await fetch(`${API_URL}/n/s/${statement.subject}`);
    if (!getResponse.ok) {
      throw new Error(`HTTP error on GET! status: ${getResponse.status}`);
    }
    const getData = await getResponse.json();
    console.log(`Fetched updated data: ${JSON.stringify(getData, null, 2)}`);
  } catch (error) {
    console.error('Error posting new statement:', error);
  }
}

export async function updateStatement(statement: Statement): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/updateEntry`, {
      method: 'PUT', // or PATCH, depending on the backend
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statement),
    });
    if (!response.ok) {
      throw new Error(`HTTP error on update! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Successfully updated statement:', data);
  } catch (error) {
    console.error('Error updating statement:', error);
  }
}
