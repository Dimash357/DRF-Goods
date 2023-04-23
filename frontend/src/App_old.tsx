import axios from "axios";
import React, { FormEvent, useEffect, useState } from "react";

function App() {
  const [getterToken, setterToken] = useState(undefined);
  const [getterUsername, setterUsername] = useState("admin@gmail.com");
  const [getterPassword, setterPassword] = useState("Qwerty!12345");
  const [getterPosts, setterPosts] = useState([]);

  const [getterFormPost, setterFormPost] = useState({
    title: "",
    description: "",
  });

  async function loginForm() {
    const response = await axios.post("http://127.0.0.1:8000/api/token/", {
      username: getterUsername,
      password: getterPassword,
    });
    console.log(response);
    if (response.status === 200) {
      setterToken(response.data);
    }
  }

  async function getPosts() {
    const response = await axios.get("http://127.0.0.1:8000/api/post/list/", {
      headers: {
        // @ts-ignore
        Authorization: `JWT_Bearer ${getterToken.access}`,
      },
    });
    console.log(response);
    if (response.status === 200) {
      setterPosts(response.data);
    }
  }

  async function createFormPost() {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/post/create/",
      {
        ...getterFormPost,
      },
      {
        headers: {
          // @ts-ignore
          Authorization: `JWT_Bearer ${getterToken.access}`,
        },
      }
    );
    console.log(response);
    if (response.status === 201) {
      await getPosts();
      setterFormPost({
        title: "",
        description: "",
      });
    }
  }

  useEffect(() => {
    // @ts-ignore
    if (getterToken && getterToken.access) {
      getPosts();
    }
  }, [getterToken]);

  return (
    <div className="App">
      {getterToken === undefined ? (
        <div className={"display-6 lead text-danger"}>Вы не авторизованы!</div>
      ) : (
        <div className={"display-6 lead text-success"}>
          Вы успешно авторизованы!
        </div>
      )}
      {getterToken === undefined ? (
        <form
          className={"form-control"}
          onSubmit={(event) => {
            event.preventDefault();
            loginForm();
          }}
        >
          <div className={"input-group w-100 shadow p-3"}>
            <input
              type={"email"}
              className={"form-control w-50"}
              value={getterUsername}
              onChange={(event) => setterUsername(event.target.value)}
            />
            <input
              type={"password"}
              className={"form-control w-25"}
              value={getterPassword}
              onChange={(event) => setterPassword(event.target.value)}
            />
            <button
              type={"submit"}
              className={"btn btn-lg btn-outline-primary w-25"}
            >
              войти в аккаунт
            </button>
          </div>
        </form>
      ) : (
        <div>
          <form
            className={"form-control"}
            onSubmit={(event) => {
              event.preventDefault();
              createFormPost();
            }}
          >
            <div className={"w-100 shadow p-3"}>
              <input
                type={"text"}
                className={"form-control w-50"}
                value={getterFormPost.title}
                onChange={(event) =>
                  setterFormPost({
                    ...getterFormPost,
                    title: event.target.value,
                  })
                }
              />
              <textarea
                className={"form-control w-25 m-1 p-1"}
                onChange={(event) =>
                  setterFormPost({
                    ...getterFormPost,
                    description: event.target.value,
                  })
                }
                value={getterFormPost.description}
              ></textarea>
              <button
                type={"submit"}
                className={"btn btn-lg btn-outline-primary w-25 m-1 p-1"}
              >
                оправить пост
              </button>
            </div>
          </form>
          <button
            className={"btn btn-lg btn-outline-warning"}
            onClick={getPosts}
          >
            Обновить посты
          </button>
        </div>
      )}
      {getterPosts && getterPosts.length > 0 && (
        <ul className={"row row-cols-5"}>
          {getterPosts.map(
            (
              item: {
                id: number;
                title: string;
                description: string;
                created: string;
              },
              index
            ) => (
              <li key={item.id} className={"nav m-0 p-1 col"}>
                <div className={"card"}>
                  <div className={"card-header"}>{item.title}</div>
                  <div className={"card-body"}>{item.description}</div>
                  <div className={"card-footer"}>
                    {item.created.split("T")[1].split(".")[0]}
                  </div>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}

export default App;
