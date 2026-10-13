(function () {
  const panels = document.querySelectorAll('.panel');

  panels.forEach((panel) => {
    const button = panel.querySelector('.panel-heading');
    const content = panel.querySelector('.panel-content');
    const icon = panel.querySelector('.panel-icon');

    button.addEventListener('click', () => {
      const willOpen = !panel.classList.contains('is-open');
      panel.classList.toggle('is-open', willOpen);
      button.setAttribute('aria-expanded', String(willOpen));
      content.hidden = !willOpen;
      icon.textContent = willOpen ? '−' : '+';
    });
  });

  function renderCourses(group) {
    const list = document.querySelector(`[data-list="${group}"]`);
    const courses = window.TURNITIN_CLASSES[group];
    list.innerHTML = courses.map((course, index) => `
      <article class="course-card" data-course-name="${escapeHtml(course.name.toLowerCase())}">
        <span class="course-index">${String(index + 1).padStart(2, '0')}</span>
        <span class="course-name">${escapeHtml(course.name)}</span>
        <a class="upload-link" href="${course.url}" target="_blank" rel="noopener noreferrer" aria-label="Upload assignment for ${escapeHtml(course.name)}">Upload assignment ↗</a>
      </article>
    `).join('');
  }

  function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[character]));
  }

  ['winter', 'previous'].forEach((group) => {
    renderCourses(group);
    const input = document.querySelector(`[data-search="${group}"]`);
    const empty = document.querySelector(`[data-empty="${group}"]`);

    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      const cards = document.querySelectorAll(`[data-list="${group}"] .course-card`);
      let visible = 0;
      cards.forEach((card) => {
        const matches = card.dataset.courseName.includes(query);
        card.hidden = !matches;
        if (matches) visible += 1;
      });
      empty.hidden = visible !== 0;
    });
  });

  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target && target.classList.contains('panel') && !target.classList.contains('is-open')) {
      target.querySelector('.panel-heading').click();
    }
  }
})();
