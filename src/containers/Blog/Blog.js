import React, { Component } from "react";
import axios from "axios";

import Post from "../../components/Post/Post";
import FullPost from "../../components/FullPost/FullPost";
import NewPost from "../../components/NewPost/NewPost";
import "./Blog.css";

class Blog extends Component {
  state = {
    posts: [],
    selectPostId: null,
    currentPage: 1,
    postsPerPage: 4,
    lastPage: null,
    error: false,
  };
  componentDidMount() {
    this.loadPosts();
  }

  loadPosts = () => {
    const { currentPage, postsPerPage } = this.state;
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;

    axios
      .get("/posts")
      .then((response) => {
        const responseItems = response.data.length;
        const lastPage = responseItems / 4;
        const posts = response.data.slice(startIndex, endIndex);
        const updatedPosts = posts.map((post) => {
          return {
            ...post,
            author: "Max",
          };
        });
        this.setState({ lastPage: lastPage });
        this.setState({ posts: updatedPosts });
      })
      .catch(() => this.setState({ error: true }));
  };

  PageChangeHandler = (pageNumber) => {
    this.setState({ currentPage: pageNumber }, () => {
      this.loadPosts();
    });
  };

  postsSelectedHandler = (id) => {
    this.setState({ selectPostId: id });
  };

  render() {
    let posts = <p style={{ textAlign: "center" }}>Went wrong in fetch posts.</p>;
    if (!this.state.error) {
      posts = this.state.posts.map((post) => {
        return (
          <Post
            key={post.id}
            title={post.title}
            author={post.author}
            onClick={() => this.postsSelectedHandler(post.id)}
          />
        );
      });
    }
    return (
      <div>
        <section className="Posts">{posts}</section>
        <button
          onClick={() => this.PageChangeHandler(this.state.currentPage - 1)}
          disabled={this.state.currentPage === 1}
        >
          Previous Page
        </button>
        <button
          onClick={() => this.PageChangeHandler(this.state.currentPage + 1)}
          disabled={this.state.currentPage === this.state.lastPage}
        >
          Next Page
        </button>
        <section>
          <FullPost id={this.state.selectPostId} />
        </section>
        <section>
          <NewPost />
        </section>
      </div>
    );
  }
}

export default Blog;
