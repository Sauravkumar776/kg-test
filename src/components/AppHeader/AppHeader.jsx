import * as PropTypes from 'prop-types';
import './AppHeader.scss';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { Link, useHistory } from 'react-router-dom';
import React, { useRef, useState } from 'react';
import Select from 'react-select';

/**
 * Get the node in `propertyLookupTree` that corresponds to `searchText`
 * @param {object} propertyLookupTree - A tree containing each property grouped by the letters in it's name.
 * @param {string} searchText - Text to look for in `propertyLookupTree`
 * @returns {object | undefined} The node in propertyLookupTree that corresponds to `searchText` or undefined if no
 * corresponding node can be found.
 */
function goToNode(propertyLookupTree, searchText) {
  if (!propertyLookupTree || !searchText) {
    return undefined;
  }

  let currentNode = propertyLookupTree;
  
  for (let i = 0; i < searchText.length; i++) {
    const char = searchText[i].toLowerCase();
    if (currentNode[char]) {
      currentNode = currentNode[char];
    } else {
      return undefined;
    }
  }
  
  return currentNode;
}

/**
 * Get an array of all of the matches in `node` and the nodes below it in the tree
 * @param {object} node - a node of the propertyLookupTree. Note: the entire tree can also be thought of as the root node.
 * @return An array of all matches under `node`
 */
function collectAllMatches(node) {
  if (!node) {
    return [];
  }

  const matches = [];
  
  // If this node has a match, add it
  if (node.match) {
    matches.push(node.match);
  }
  
  // Recursively collect matches from child nodes
  Object.keys(node).forEach(key => {
    if (key !== 'match' && typeof node[key] === 'object') {
      matches.push(...collectAllMatches(node[key]));
    }
  });
  
  return matches;
}

/**
 * Find all properties in propertyLookupTree where the name starts with `searchText`
 * @param {object} propertyLookupTree - A tree containing each property grouped by the letters in it's name.
 * @example if there were 3 properties named "B", "Bar" and "Baz" then propertyLookupTree would be:
  {
    b: {
      match: {id: "b", name: "B"},
      a: {
        r: {
          match: {id: "bar", name: "Bar"}
        },
        z: {
          match: {id: "baz", name: "Baz"}
        }
      }
    }
  }
 * @param {string} searchText - lowercase text to be used to find matching properties
 * @return A list of match objects (with `name` and `id` properties) for properties that match `searchText`
 * @example if `searchText` is "ba" and `propertyLookupTree` is the example listed above then the return value would be:
 * [{id: "bar", name: "Bar"}, {id: "baz", name: "Baz"}]
 */
export function findMatches(propertyLookupTree, searchText) {
  if (!propertyLookupTree || !searchText) {
    return [];
  }

  const targetNode = goToNode(propertyLookupTree, searchText);
  if (!targetNode) {
    return [];
  }

  return collectAllMatches(targetNode);
}

function AppHeader({ propertyLookupTree }) {
  const [searchOptions, setSearchOptions] = useState([]);
  const history = useHistory();
  const searchSelectRef = useRef(null);

  function onSearchChange(searchText) {
    if (searchText.length > 0) {
      let matches = findMatches(propertyLookupTree, searchText.toLowerCase());
      let options = matches.map((match) => ({ value: match.id, label: match.name }));
      setSearchOptions(options);
    } else {
      setSearchOptions([]);
    }
  }

  function onSearchSelect(selectedItem, { action }) {
    setSearchOptions([]);
    if (action === 'select-option') {
      setTimeout(() => searchSelectRef.current.select.clearValue(), 0);
      history.push('/property/' + selectedItem.value);
    }
  }

  return (
    <div className="app-header">
      <Link to="/" className="logo-wrapper">
        <Logo className="logo" />
        Kbnb
      </Link>
      <Select
        className="react-select-container"
        classNamePrefix="react-select"
        options={searchOptions}
        onInputChange={onSearchChange}
        onChange={onSearchSelect}
        placeholder="Search"
        noOptionsMessage={() => 'Enter a property name...'}
        ref={searchSelectRef}
      />
    </div>
  );
}

AppHeader.propTypes = {
  propertyLookupTree: PropTypes.object,
};

export default AppHeader;