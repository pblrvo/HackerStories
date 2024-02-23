import PropTypes from 'prop-types';
import React from 'react';

const App = () =>  {
  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const [searchTerm, setSearchTerm] = React.useState(localStorage.search || '');

  React.useEffect(() => {
    localStorage.setItem('search', searchTerm)
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }  

  const searchedStories = stories.filter(function (story){
    return story.title.toLowerCase().includes(searchTerm.toLowerCase())
  })
  return (
    <div>
      <h1>My Hacker Stories</h1>

      <Search search={searchTerm} onSearch={handleSearch}/>
      <List list={searchedStories}/>
    </div>
  )};


const Search = ({search, onSearch}) => {
  return(
    <div>
      <label htmlFor='search'>Search: </label>
      <input id='search' type='text' value={search} onChange={onSearch} />
    </div>    
  )};


const List = ({list}) => {
  return (
    <ul>
      {list.map(({objectID, ...item}) => (
        <Item key={objectID} {...item} />)
      )}
    </ul>
)};

const Item = ({url, title, author, num_comments, points}) => {
  return (
  <li>
    <span>
    <a href={url}>{title}</a>
    </span><br />
    <span>Author: {author}</span><br />
    <span>Number of comments: {num_comments}</span><br />
    <span>Points: {points}</span><br />
  </li>
)};

Search.propTypes = {
  search: PropTypes.string,
  onSearch: PropTypes.func,
}
List.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      num_comments: PropTypes.number.isRequired,
      points: PropTypes.number.isRequired,
      objectID: PropTypes.number.isRequired,
    })
  ).isRequired,
};

Item.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  num_comments: PropTypes.number.isRequired,
  points: PropTypes.number.isRequired,
  objectID: PropTypes.number,
};


export default App
