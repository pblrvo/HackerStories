import PropTypes from 'prop-types';
import React from 'react';

const App = () =>  {
  const initialStories = [
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

  const useStorageState = (key, initialState) =>{
    const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

    React.useEffect(() => {
      localStorage.setItem(key, value)
    }, [value, key]);

    return [value, setValue];
  };

  const [searchTerm, setSearchTerm] = useStorageState('search', localStorage.search || '');

  const [stories, setStories] = React.useState(initialStories);

  const handleRemoveStory = (objectID) => {
    const newStories = stories.filter(
      (story) => story.objectID !== objectID
    );
  
    setStories(newStories);
  }
  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }  

  const searchedStories = stories.filter(function (story){
    return story.title.toLowerCase().includes(searchTerm.toLowerCase())
  })
  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel id="search" type="text" value={searchTerm} isFocused onInputChange={handleSearch}>Search: </InputWithLabel>
      <List list={searchedStories} onRemoveItem={handleRemoveStory}/>
    </div>
  )};

const InputWithLabel = ({id, type='text', value, isFocused, onInputChange, children,}) => {

  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused])

  return(
    <>
      <label htmlFor={id}>{children}</label>
      <input ref={inputRef} id={id} type={type} value={value} autoFocus={isFocused} onChange={onInputChange} />
    </>    
  )};


  const List = ({list, onRemoveItem}) => {
    return (
      <ul>
        {list.map((item) => (
          <Item key={item.objectID} {...item} onRemoveItem={onRemoveItem}/>) 
        )}
      </ul>
    )};

const Item = ({title, url, author, num_comments, points, objectID, onRemoveItem}) => {
  const handleRemoveItem = () => {
    onRemoveItem(objectID);
  }

  return (
  <li>
    <span>
    <a href={url}>{title}</a>
    </span><br />
    <span>Author: {author}</span><br />
    <span>Number of comments: {num_comments}</span><br />
    <span>Points: {points}</span><br />
    <span>
      <button type='button' onClick={handleRemoveItem}>Remove {title}</button>
    </span>
  </li>
)};

InputWithLabel.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.string,
  isFocused: PropTypes.bool,
  onInputChange: PropTypes.func,
  children: PropTypes.node,
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
  onRemoveItem: PropTypes.func,
};

Item.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  num_comments: PropTypes.number.isRequired,
  points: PropTypes.number.isRequired,
  objectID: PropTypes.number,
  onRemoveItem: PropTypes.func,
};


export default App
