import React, { FC } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

const query = gql`
  {
    organization(login: "apollographql") {
      repositories(first: 5, isFork: false) {
        nodes {
          id
          name
          url
          viewerHasStarred
          stargazers {
            totalCount
          }
        }
      }
    }
  }
`;

const ADD_STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const REMOVE_STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    removeStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const App: FC<any> = ({ data: { loading, organization, error } }) => {
  if (loading) return <p>Loading...</p>;

  console.log(error);

  const repositories = organization.repositories.nodes;

  return (
    <ul>
      {repositories.map((repo: any) => (
        <li key={repo.id}>
          <a href={repo.url}>{repo.name}</a>
          <button>{repo.stargazers.totalCount} Stars</button>
          {!repo.viewerHasStarred ? (
            <Mutation<any, any>
              mutation={ADD_STAR_REPOSITORY}
              variables={{ id: repo.id }}
            >
              {(addStar, { data, loading, error }) => (
                <button onClick={() => addStar}>star</button>
              )}
            </Mutation>
          ) : (
            <Mutation<any, any>
              mutation={REMOVE_STAR_REPOSITORY}
              variables={{ id: repo.id }}
            >
              {(removeStar, { data, loading, error }) => (
                <button onClick={() => removeStar}>unstar</button>
              )}
            </Mutation>
          )}
        </li>
      ))}
    </ul>
  );
};

export default graphql(query)(App);
