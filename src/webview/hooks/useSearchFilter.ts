import React from 'react';

const useSearchFilter = (notes, searchText) => {
  const lowerCasedSearch = searchText.toLowerCase();
  const notesToShow = React.useMemo(
    () =>
      notes?.filter(({ title, text }) => {
        return (
          title.toLowerCase().indexOf(lowerCasedSearch) !== -1 ||
          text.toLowerCase().indexOf(lowerCasedSearch) !== -1
        );
      }) || [],
    [notes, lowerCasedSearch]
  );

  return notesToShow;
};

export default useSearchFilter;
