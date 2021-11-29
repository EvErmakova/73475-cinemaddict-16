const createMainNavigationItemTemplate = ({name, count}) => {
  const title = name[0].toUpperCase() + name.slice(1);

  return `<a href="#${name}" class="main-navigation__item">
    ${title} <span class="main-navigation__item-count">${count}</span>
  </a>`;
};

export const createMainNavigationTemplate = (filters) => {
  const navigationItems = filters.map(createMainNavigationItemTemplate).join('\n');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${navigationItems}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};
