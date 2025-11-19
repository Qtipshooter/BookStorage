

/**
 * Renders the HTML for adding the hydration script to the page.  
 * @param {string} html_string The HTML rendering of the application to be injected
 * @param {string} bundle_file The bundle file location in the static folder to be pulled from
 * @param {string} head_block The HTML rendering of the <head> block with meta data and such to send
 * @returns the rendered HTML document as a whole string
 */
export function render_HTML(html_string, bundle_file, head_block) {
  let var_head_block = `<head><title>Book Storage</title></head>`;
  if (typeof head_block === "string") { var_head_block = head_block; }

  return `<!DOCTYPE html>
    <html>
      ${var_head_block}
      <body>
        <div id="root">${html_string}</div>
        <script src="/static/${bundle_file}"></script>
      </body>
    </html>`;
}
