export function renderList(container, htmlArray) {
  const fragment = document.createDocumentFragment();
  htmlArray.forEach((html) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    fragment.appendChild(wrapper.firstElementChild);
  });
  container.innerHTML = '';
  container.appendChild(fragment);
}
