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

  const [searchTerm, setSearchTerm] = React.useState('React');

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
      <p>
        Searching for <strong>{searchTerm}</strong>
      </p>
      <List list={searchedStories}/>
    </div>
  )};


const Search = (props) => {
  return(
    <div>
      <label htmlFor='search'>Search: </label>
      <input id='search' type='text' onChange={props.onSearch} value={props.search}/>
    </div>    
  )};


const List = (props) => {
  return (
    <ul>
      {props.list.map((item) => (
        <Item key={item.objectID} item={item}/>)
      )}
    </ul>
)};

const Item = (props) => {
  return (
  <li>
    <span>
    <a href={props.item.url}>{props.item.title}</a>
    </span><br />
    <span>Author: {props.item.author}</span><br />
    <span>Number of comments: {props.item.num_comments}</span><br />
    <span>Points: {props.item.points}</span><br />
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
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    num_comments: PropTypes.number.isRequired,
    points: PropTypes.number.isRequired,
    objectID: PropTypes.number.isRequired,
  }).isRequired,
};


export default App
