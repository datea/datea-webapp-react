import React from 'react';
import Link from '../link';

const Tags = ({tags}) =>
  <div className="tags">
    {tags.map(tag =>
      <Link key={tag} className="tag" view="tag" params={{tag}}>#{tag}</Link>
    )}
  </div>

export default Tags;
