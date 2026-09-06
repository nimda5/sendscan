// SendScan — signup form placeholder handling.
// No backend exists yet (decided to defer); this only validates and shows a
// local confirmation state so the page is demo-able before the capture
// mechanism (e.g. a form service) is wired up.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-signup-form]').forEach(function (wrapper) {
    var form = wrapper.querySelector('form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      if (input && !input.checkValidity()) {
        input.reportValidity();
        return;
      }
      wrapper.classList.add('is-submitted');
    });
  });
});
