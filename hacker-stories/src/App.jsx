import PropTypes from 'prop-types';
import React from 'react';

const App = () =>  {

  const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

  const storiesReducer = (state, action) => {
    switch (action.type){
      case 'STORIES_FETCH_INIT':
        return{
          ...state,
          isLoading: true,
          isError: false,
        }

      case 'STORIES_FETCH_SUCCESS':
      return{
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      }
      case 'STORIES_FETCH_FAILURE':
      return{
        ...state,
        isLoading: false,
        isError: true,
      }

      case 'REMOVE_STORY':
        return {
          ...state,
          data: state.data.filter(story => action.payload !== story.objectID),
        };

      default:
        throw new Error();
      }
    }

  const useStorageState = (key, initialState) =>{
    const [value, setValue] = React.useState(localStorage.getItem(key) || initialState);

    React.useEffect(() => {
      localStorage.setItem(key, value)
    }, [value, key]);

    return [value, setValue];
  };

  const [searchTerm, setSearchTerm] = useStorageState('search', localStorage.getItem('search') || '');

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [], isLoading: false, isError: false
  });

  const handleFetchStories = React.useCallback(() => {
    console.log('useEffect called with searchTerm:', searchTerm);
    if (!searchTerm) return;

    dispatchStories({type: 'STORIES_FETCH_INIT'});

    const url = `${API_ENDPOINT}${searchTerm}`;
    console.log('Fetching data from URL:', url);

    fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json()
    }).then(result => {
      console.log(result)
      if (!result || !result.hits || !Array.isArray(result.hits)) {
        throw new Error('The data returned from the API is not in the expected format');
      }

      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.hits,
      });
    }).catch(error =>{
      console.error('There was a problem with the fetch operation:', error);
      dispatchStories({type: 'STORIES_FETCH_FAILURE'})
    }
    );
  }, [searchTerm]);

  React.useEffect(() =>{
    handleFetchStories();
  
  }
, [handleFetchStories]);

  const handleRemoveStory = (objectID) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: objectID,
    })
  }
  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }  

  /*const searchedStories = stories.data.filter((story) => {
    return story.title.toLowerCase().includes(searchTerm.toLowerCase())
  })*/

  return (
    <div>
      <h1>My Hacker Stories</h1>

      <InputWithLabel id="search" type="text" value={searchTerm} isFocused onInputChange={handleSearch}>Search: </InputWithLabel>

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
      <List 
        list={stories.data} 
        onRemoveItem={handleRemoveStory}
      />
      )}

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
    </span> <span>
      <button type='button' onClick={handleRemoveItem}>Remove {title}</button>
    </span>
    <br />
    <span>Author: {author}</span><br />
    <span>Number of comments: {num_comments}</span><br />
    <span>Points: {points}</span><br />
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
