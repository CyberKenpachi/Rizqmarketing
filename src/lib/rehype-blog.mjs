// Keeps blog bodies SEO-clean: the post title is the page's only H1, so a "#" heading
// in Markdown is demoted to H2, and body images lazy-load.
export default function rehypeBlogBody() {
  const walk = (node) => {
    if (node.type === 'element') {
      if (node.tagName === 'h1') node.tagName = 'h2';
      if (node.tagName === 'img') {
        node.properties = { loading: 'lazy', decoding: 'async', ...node.properties };
      }
    }
    node.children?.forEach(walk);
  };
  return (tree) => walk(tree);
}
