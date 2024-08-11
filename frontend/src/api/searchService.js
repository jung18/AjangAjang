export const fetchSearchResults = async (searchTerm, category) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/board/search?title=${searchTerm}&category=${category}`
    );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch search results:', error);
      throw error;
    }
  };
  