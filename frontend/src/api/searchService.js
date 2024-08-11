export const fetchSearchResults = async (searchTerm, category) => {
    try {
      const response = await fetch(
        `https://i11b210.p.ssafy.io:8443/api/board/search?title=${searchTerm}&category=${category}`
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
  