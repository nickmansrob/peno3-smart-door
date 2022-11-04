import { useState, useEffect } from "react";

const Test = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("https://styx.rndevelopment.be/api/users")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPosts(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const render = posts.map((post, id) => {
    return <div key={id.toString()}>{JSON.stringify(post)}</div>;
  });

  return render;
};

export default Test;
