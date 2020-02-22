import React, { Component } from 'react';
import config from '../config';
import PropTypes from 'prop-types';
import BookmarksContext from '../BookmarksContext';

class EditBookmark extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object
    }),
    history: PropTypes.shape({
      push: PropTypes.func
    }).isRequired
  };

  static contextType = BookmarksContext;

  state = {
    id: '',
    title: '',
    url: '',
    description: '',
    rating: 1
  };

  handleChangeTitle = e => {
    this.setState({ title: e.target.value });
  };

  handleChangeUrl = e => {
    this.setState({ url: e.target.value });
  };

  handleChangeDescription = e => {
    this.setState({ description: e.target.value });
  };

  handleChangeRating = e => {
    this.setState({ rating: e.target.value });
  };

  componentDidMount() {
    const { bookmarkId } = this.props.match.params;
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) return res.json().then(error => Promise.reject(error));
        return res.json();
      })
      .then(responseData => {
        this.setState({
          id: responseData.id,
          title: responseData.title,
          url: responseData.url,
          description: responseData.description,
          rating: responseData.rating
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({ error });
      });
  }
  handleSubmit = e => {
    e.preventDefault();
    const { bookmarkId } = this.props.match.params;
    const { id, title, url, description, rating } = this.state;
    const newBookmark = { id, title, url, description, rating };
    fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(newBookmark),
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) return res.json().then(error => Promise.reject(error));
      })
      .then(() => {
        this.resetFields(newBookmark);
        this.context.updateBookmark(newBookmark);
        this.props.history.push('/');
      })
      .catch(error => {
        console.error(error);
        this.setState({ error });
      });
  };
  resetFields = newFields => {
    this.setState({
      id: newFields.id || '',
      title: newFields.title || '',
      url: newFields.url || '',
      description: newFields.description || '',
      rating: newFields.rating || ''
    });
  };

  handleClickCancel = () => {
    this.props.history.push('/');
  };
  render() {
    const { title, url, description, rating } = this.state;
    return (
      <div className="EditBookmark">
        <h2>Edit Bookmark</h2>
        <form className="EditBookmark__form" onSubmit={this.handleSubmit}>
          <input type="hidden" name="id" />
          <div>
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" required value={title} onChange={this.handleChangeTitle} />
          </div>
          <div>
            <label htmlFor="url">URL</label>
            <input type="text" name="url" id="url" required value={url} onChange={this.handleChangeURL} />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <input
              type="text"
              name="description"
              id="description"
              required
              value={description}
              onChange={this.handleChangeDescription}
            />
          </div>
          <div>
            <label htmlFor="rating">Rating</label>
            <input type="number" name="rating" id="rating" required value={rating} onChange={this.handleChangeRating} />
            <button type="button" onClick={this.handleClickCancel}>
              Cancel
            </button>{' '}
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    );
  }
}

export default EditBookmark;
