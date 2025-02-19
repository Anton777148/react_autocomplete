import debounce from 'lodash.debounce';
import React, { useEffect, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [debounceQuery, setDebounceQuery] = useState('');
  const [selectPerson, setSelectPerson] = useState<Person | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredPeople = peopleFromServer.filter(person =>
    person.name.toLowerCase().includes(debounceQuery.trim().toLowerCase()),
  );

  useEffect(() => {
    const handler = debounce(() => setDebounceQuery(query), 300);

    handler();

    return () => handler.cancel();
  }, [query]);

  const handleSelectChange = (person: Person) => {
    setSelectPerson(person);
    setQuery(person.name);
    setIsDropdownOpen(false);
  };

  const handleInputCange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsDropdownOpen(true);
    setSelectPerson(null);
  };

  const handleBlur = () => {
    if (
      dropdownRef.current &&
      dropdownRef.current.contains(document.activeElement)
    ) {
      return;
    }

    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (selectPerson && query !== selectPerson.name) {
      setSelectPerson(null);
    }
  }, [query, selectPerson]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectPerson
            ? `${selectPerson.name} (${selectPerson.born} - ${selectPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isDropdownOpen ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleInputCange}
              onFocus={() => setIsDropdownOpen(true)}
              onBlur={handleBlur}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item has-text-link"
                  onMouseDown={() => handleSelectChange(person)}
                  data-cy="suggestion-item"
                >
                  {person.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {filteredPeople.length === 0 && query.trim() && (
          <div className="dropdown-item" data-cy="no-suggestions-message">
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
