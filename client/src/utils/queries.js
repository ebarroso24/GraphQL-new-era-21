// // queries.js
// import { gql } from '@apollo/client';

// export const GET_ME = gql`
//   query me {
//     me {
//       _id
//       username
//       email
//       savedBooks {
//         _id
//         authors
//         description
//         bookId
//         image
//         link
//         title
//       }
//     }
//   }
// `;

// queries.js
import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
        _id
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;

export const SAVE_BOOK = gql`
  mutation saveBook($input: BookInput!) {
    saveBook(input: $input) {
      _id
      username
      email
      savedBooks {
        _id
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {
    removeBook(bookId: $bookId) {
      _id
      username
      email
      savedBooks {
        _id
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;

export const searchGoogleBooks = async (query) => {
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    const { items } = await response.json();

    const bookData = items.map((book) => ({
      bookId: book.id,
      authors: book.volumeInfo.authors || ['No author to display'],
      title: book.volumeInfo.title,
      description: book.volumeInfo.description,
      image: book.volumeInfo.imageLinks?.thumbnail || '',
    }));

    return bookData;
  } catch (err) {
    console.error(err);
    throw err; // Rethrow the error to handle it where the function is called
  }
};
