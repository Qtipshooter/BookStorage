

/**
 * Renders the HTML for adding the hydration script to the page.  
 * @param {*} html_string The HTML rendering of the application to be injected
 * @param {*} bundle_file The bundle file location in the static folder to be pulled from
 * @returns the rendered HTML document as a whole string
 */
export function render_HTML(html_string, bundle_file) {

  return `<!DOCTYPE html>
    <html>
      <head><title>Book Storage</title></head>
      <body>
        <div id="root">${html_string}</div>
        <script src="/static/${bundle_file}"></script>
      </body>
    </html>`;
}
