import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const GET_MOVIE = gql`
  query getMovie($movieId: String!) {
    movie(id: $movieId) {
      id
      title
      small_cover_image
      medium_cover_image
      rating
      isLiked @client
    }
  }
`;

const Container = styled.div`
  height: 100vh;
  background-image: linear-gradient(-45deg, #d754ab, #fd723a);
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: white;
`;

const Column = styled.div`
  margin-left: 10px;
  width: 50%;
`;

const Title = styled.h1`
  font-size: 65px;
  margin-bottom: 15px;
`;

const Detail = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Subtitle = styled.h4`
  font-size: 35px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  font-size: 28px;
  background: none;
  border: 0;
`;

const Image = styled.div`
  width: 25%;
  height: 60%;
  background-color: transparent;
  background-image: url(${(props) => props.bg});
  background-size: cover;
  background-position: center center;
  border-radius: 7px;
`;

export default function Movie() {
  const { id } = useParams();
  const {
    data,
    loading,
    client: { cache },
  } = useQuery(GET_MOVIE, {
    variables: {
      movieId: id,
    },
  });

  const onClick = () => {
    cache.writeFragment({
      id: `Movie:${id}`,
      fragment: gql`
        fragment MovieFragment on Movie {
          isLiked
        }
      `,
      data: {
        isLiked: !data.movie.isLiked,
      },
    });
  };

  return (
    <Container>
      <Column>
        <Title>{loading ? 'Loading...' : `${data.movie?.title}`}</Title>
        <Detail>
          <Subtitle>⭐️ {data?.movie?.rating}</Subtitle>
          <Button onClick={onClick}>
            {data?.movie?.isLiked ? '🤍' : '❤️'}
          </Button>
        </Detail>
      </Column>
      <Image bg={data?.movie?.medium_cover_image} />
    </Container>
  );
}
