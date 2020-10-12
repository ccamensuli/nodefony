import * as React from "react";
import { render } from "react-dom";
import GraphiQL from "graphiql";
import "graphiql/graphiql.min.css";
import "./index.css";
const NODE_ENV = process.env.NODE_ENV ;
const DEBUG = process.env.DEBUG ;
const config = process.env.GRAPHIQL ;

const URL = config.url;

function graphQLFetcher(graphQLParams) {
  return fetch(URL, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(graphQLParams),
    credentials: 'same-origin',
  }).then(response => response.json().then((ele)=>{
    console.log(ele)
    return ele.data;
  }));
}

const defaultQuery = `
{
  user(username: "admin") {
    username
     surname
     name
   }
   users {
     username
     name
     surname
     updatedAt
     roles
   }
}
`;

const container = document.getElementById("graphiql");
const Logo = () => {
  return <span className="graphiql-container" style={{width:"15%"}}>
    <img width="30px" heigth="30px" src={config.logo}></img>
    <span className="">
      {config.projectName}
    </span>
  </span>;
}

// See GraphiQL Readme - Advanced Usage section for more examples like this
GraphiQL.Logo = Logo;

render(
  <GraphiQL fetcher={graphQLFetcher} defaultQuery={defaultQuery} />,
  container
);
