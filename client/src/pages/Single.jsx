import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext.jsx";

import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import Menu from "../pages/Menu";

import axios from "axios";
import moment from "moment";

const Single = () => {
  const [post, setPost] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  const postId = location.pathname.split("/")[2];

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/posts/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/posts/${postId}`);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");

    return doc.body.textContent;
  }

  return (
    <div className="single">
      <div className="content">
        <img src={`../upload/${post?.img}`} />
        <div className="user">
          {post.userImg ? (
            <img src={post?.userImg} />
          ) : (
            <img src="https://i.pinimg.com/564x/22/73/15/22731510633e26da89180e4b3c57d40e.jpg" />
          )}
          <div className="info">
            <span>{post?.username}</span>
            <span>Posted {moment(post.date).fromNow()}</span>
          </div>
          {currentUser?.username === post?.username && (
            <div className="edit">
              <Link to={`/write?edit=2`} state={post}>
                <img src={Edit} />
              </Link>
              <img onClick={handleDelete} src={Delete} />
            </div>
          )}
        </div>
        <h1>{post?.title}</h1>
        {getText(post?.desc)}
      </div>
      <Menu cat={post.cat}/>
    </div>
  );
};

export default Single;
